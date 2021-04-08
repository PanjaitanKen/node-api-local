const pool = require('../../db');

// Tabel : employee_work_off_tbl, wage_code_tbl
const controller = {
  getHist_attendance(request, response) {
    try {
      const { employee_id, filter_hari, jenis_izin } = request.body;

      pool.db_MMFPROD.query(
        `select b.wage_name as jenis_ijin,
        a.employee_id as Nokar, to_char(work_off_from,'DD Mon YYYY') ||' - '|| to_char(work_off_to,'DD Mon YYYY') tglIjin,
        work_off_from::timestamp::time ||' - '||work_off_to::timestamp::time Waktu, reason alasan,
        to_char(c.status_date,'DD Mon YYYY') as tglpengajuan,
        case when state='Approved' then 'Disetujui'
        when state='Rejected' then 'Ditolak'
        when state='Submitted' then 'Menunggu Persetujuan'
        when state='Cancelled' then 'Batal' end as Status,
        a.golid from employee_work_off_tbl a
        left join wage_code_tbl b on a.absence_wage =b.wage_code
        left join
        (select employee_id ,sequence_no ,status_date
        from work_off_status_tbl
        where employee_id = $1 and status='Submitted'
        group by employee_id ,sequence_no ,status_date
        order by status_date desc ) c on a.employee_id = c.employee_id and a.sequence_no = c.sequence_no
        where a.employee_id= $1 and c.status_date between (current_date -interval '1 days' * $2 ) and now()
        and b.wage_name = ANY($3)
        order by c.status_date desc`,
        [employee_id, filter_hari, jenis_izin],
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
