const pool = require('../../db');

// Tabel : employee_work_off_tbl, wage_code_tbl
const controller = {
  async getDetailHist_attendance(request, response) {
    try {
      const { employee_id, golid } = request.body;

      const query =
        ' select b.wage_name as jenis_ijin, a.employee_id as Nokar, ' +
        " to_char(work_off_from,'DD Mon YYYY') ||' - '|| to_char(work_off_to,'DD Mon YYYY') tglIjin, " +
        " work_off_from::timestamp::time ||' - '||work_off_to::timestamp::time Waktu, reason alasan, " +
        " to_char(clocking_date,'DD-MM-YYYY') as tglpengajuan, " +
        " case when a.state='Approved' then 'Disetujui' " +
        " when a.state='Rejected' then 'Ditolak' " +
        " when a.state='Submitted' then 'Menunggu Persetujuan' " +
        " when a.state='Cancelled' then 'Batal' end as Status,a.golid , " +
        " a.employee_id||'/'||to_char(c.status_date,'YYYYMMDD')||'/'||trim(to_char(a.sequence_no,'9999999999999999')) as nobukti , " +
        " case when a.state='Approved' then 'Disetujui' " +
        " when a.state='Rejected' then 'Ditolak' " +
        " when a.state='Submitted' then 'Menunggu Persetujuan' " +
        " when a.state='Cancelled' then 'Batal' " +
        " end||' '||initcap(f.display_name) nama_penyetuju " +
        ' from employee_work_off_tbl a ' +
        ' left join wage_code_tbl b on a.absence_wage = b.wage_code ' +
        ' left join (select employee_id ,sequence_no ,status_date ' +
        ' from work_off_status_tbl a ' +
        " where employee_id = $1 and status='Submitted' " +
        ' group by employee_id ,sequence_no ,status_date ' +
        ' order by status_date desc ) c on a.employee_id = c.employee_id and a.sequence_no = c.sequence_no ' +
        " left join approval_structure_tbl d on a.golid = d.ref_id and d.template_name='APPROVAL_WORK_OFF'  " +
        ' left join employee_tbl  e on d.approver_id = e.employee_id  ' +
        ' left join person_tbl f on e.person_id =f.person_id  ' +
        ' where a.employee_id= $1  and a.golid=$2 ' +
        ' order by clocking_date desc ';
      await pool.db_MMFPROD
        .query(query, [employee_id, golid])
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
