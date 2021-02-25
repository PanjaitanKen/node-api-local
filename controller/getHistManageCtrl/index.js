const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getHistManage(request, response) {
    try {
      const { employee_id, jumlah_hari, jenis_cuti } = request.body;

      pool.db_MMFPROD.query(
        `with x as (
          select 'Persetujuan Cuti' as Jenis, a.employee_id , b.sequence_no as no_urut,  initcap(d.display_name) nama,
          case  when current_date-b.status_date=0 then 'Hari ini'
            when current_date-b.status_date=1 then 'Kemarin'
            when current_date-b.status_date=2 then '2 Hari yang lalu'
            when current_date-b.status_date=3 then '3 Hari yang lalu'
            when current_date-b.status_date=4 then '4 Hari yang lalu'
            when current_date-b.status_date=5 then '5 Hari yang lalu'
            when current_date-b.status_date=6 then '6 Hari yang lalu'
            when current_date-b.status_date=7 then '7 Hari yang lalu'
            when current_date-b.status_date>7 then to_char(b.status_date,'DD Mon YYYY') 
          end Durasi_Waktu ,b.status_date, a.golid
          from leave_request_tbl a
          left join l_r_status_history_tbl b on a.employee_id =b.employee_id and a.sequence_no = b.sequence_no  and b.status<>'Submitted'
          left join employee_tbl  c on a.employee_id = c.employee_id 
          left join person_tbl d on c.person_id =d.person_id 
          where  state not in ('Submitted') and 
          b.status_date between (current_date -interval '1 days' * $2) and now()
          --order by b.status_date desc,a.sequence_no desc
          union all 
          select 'Persetujuan Ijin' as Jenis, a.employee_id,  b.sequence_no as no_urut, initcap(d.display_name) nama,
          case  when current_date-b.status_date=0 then 'Hari ini'
            when current_date-b.status_date=1 then 'Kemarin'
            when current_date-b.status_date=2 then '2 Hari yang lalu'
            when current_date-b.status_date=3 then '3 Hari yang lalu'
            when current_date-b.status_date=4 then '4 Hari yang lalu'
            when current_date-b.status_date=5 then '5 Hari yang lalu'
            when current_date-b.status_date=6 then '6 Hari yang lalu'
            when current_date-b.status_date=7 then '7 Hari yang lalu'
            when current_date-b.status_date>7 then to_char(b.status_date,'DD Mon YYYY') 
          end Durasi_Waktu ,b.status_date, a.golid
          from employee_work_off_tbl  a
          left join l_r_status_history_tbl b on a.employee_id =b.employee_id and a.sequence_no = b.sequence_no  and b.status<>'Submitted'
          left join employee_tbl  c on a.employee_id = c.employee_id 
          left join person_tbl d on c.person_id =d.person_id 
          where  state not in ('Submitted') and 
          b.status_date between (current_date -interval '1 days' *  $2 ) and now()
          --order by b.status_date desc,a.sequence_no desc
        ) select * from x
        where Jenis = ANY($3)  
        and employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id =$1
        and valid_to=date'9999-01-01') 
        order by status_Date desc , no_urut desc`,
        [employee_id, jumlah_hari, jenis_cuti],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: results.rows,
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: employee_id,
              data: results.rows,
            });
          }
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
