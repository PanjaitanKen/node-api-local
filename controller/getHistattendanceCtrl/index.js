const pool = require('../../db');
const axios = require('axios');

// Tabel : employee_work_off_tbl, wage_code_tbl
const controller = {
  async getHist_attendance(request, response) {
    try {
      const { employee_id, filter_hari, jenis_izin } = request.body;

      //insert log activity user -- start
      const data = {
        employee_id: employee_id,
        menu: 'Izin',
      };

      const options = {
        headers: {
          'Content-Type': 'application/json',
          API_KEY: process.env.API_KEY,
        },
      };

      axios
        .post(process.env.URL + '/hcm/api/addLogUser', data, options)
        .then((res) => {
          console.log('RESPONSE ==== : ', res.data);
        })
        .catch((err) => {
          console.log('ERROR: ====', err);
        });
      //insert log activity user -- end

      const query = `select b.wage_name as jenis_ijin,
        a.employee_id as Nokar, to_char(work_off_from,'DD Mon YYYY') ||' - '|| to_char(work_off_to,'DD Mon YYYY') tglIjin,
        work_off_from::timestamp::time ||' - '||work_off_to::timestamp::time Waktu, reason alasan,
        to_char(c.status_date,'DD Mon YYYY') as tglpengajuan,
        case when a.state='Approved' then 'Disetujui'
        when a.state='Rejected' then 'Ditolak'
        when a.state='Submitted' then 'Menunggu Persetujuan'
        when a.state='Cancelled' then 'Batal' end as Status,
        a.golid ,
        a.employee_id||'/'||to_char(c.status_date,'YYYYMMDD')||'/'||trim(to_char(a.sequence_no,'9999999999999999')) as nobukti , 
 		    case when a.state='Approved' then 'Disetujui' 
				when a.state='Rejected' then 'Ditolak' 
 				when a.state='Submitted' then 'Menunggu Persetujuan' 
 				when a.state='Cancelled' then 'Batal' 
		    end||' '||initcap(f.display_name) nama_penyetuju 
        from employee_work_off_tbl a
        left join wage_code_tbl b on a.absence_wage =b.wage_code
        left join
        (select employee_id ,sequence_no ,status_date
        from work_off_status_tbl a
        where employee_id = $1 and status='Submitted'
        group by employee_id ,sequence_no ,status_date
        order by status_date desc ) c on a.employee_id = c.employee_id and a.sequence_no = c.sequence_no
        left join approval_structure_tbl d on a.golid = d.ref_id and d.template_name='APPROVAL_WORK_OFF' 
         left join employee_tbl  e on d.approver_id = e.employee_id  
		    left join person_tbl f on e.person_id =f.person_id  
        where a.employee_id= $1 and c.status_date between (current_date -interval '1 days' * $2 ) and now()
        and b.wage_name = ANY($3)
        order by c.status_date desc`;
      await pool.db_MMFPROD
        .query(query, [employee_id, filter_hari, jenis_izin])
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: rows,
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: employee_id,
              data: '',
            });
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
