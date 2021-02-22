const pool = require('../../db');

// Tabel : employee_work_off_tbl, wage_code_tbl
const controller = {
  getDetailHist_attendance(request, response) {
    try {
      const { employee_id, golid } = request.body;

      pool.db_MMFPROD.query(
        "select b.wage_name as jenis_ijin, a.employee_id as Nokar, to_char(work_off_from,'DD Mon YYYY') ||' - '|| to_char(work_off_to,'DD Mon YYYY') tglIjin, work_off_from::timestamp::time ||' - '||work_off_to::timestamp::time Waktu, reason alasan, to_char(clocking_date,'DD-MM-YYYY') as tglpengajuan, case when state='Approved' then 'Disetujui' when state='Rejected' then 'Ditolak' when state='Submitted' then 'Menunggu Persetujuan' when state='Cancelled' then 'Batal' end as Status,a.golid from employee_work_off_tbl a left join wage_code_tbl b on a.absence_wage =b.wage_code where employee_id=$1 and a.golid=$2 order by clocking_date desc",
        [employee_id, golid],
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
