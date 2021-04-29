const pool = require('../../db');

// Tabel : leave_request_tbl, employeetbl, persontbl
const controller = {
  getDetail_WorkOff_App(request, response) {
    try {
      const { golid } = request.body;

      pool.db_MMFPROD.query(
        `select a.employee_id, b.wage_name  as jenis_ijin, d.display_name as nama,
        to_char(work_off_from,'MM-DD-YYYY') as tgl_ijin_dari,
        to_char(work_off_to,'MM-DD-YYYY') as tgl_ijin_sd, reason as alasan,
        to_char(e.status_date,'MM-DD-YYYY') as tgl_pengajuan,a.golid,
        case when a.state='Approved' then 'Disetujui'
        when a.state='Rejected' then 'Ditolak'
        when a.state='Submitted' then 'Menunggu Persetujuan'
        when a.state='Cancelled' then 'Batal' end as Status,
        to_char(work_off_from,'HH24:MI')||' - '||to_char(work_off_to,'HH24:MI') waktu,
        a.employee_id||'/'||to_char(e.status_date,'YYYYMMDD')||'/'||trim(to_char(a.sequence_no,'9999999999999999')) as nobukti 
        from employee_work_off_tbl a
        left join wage_code_tbl b on a.absence_wage =b.wage_code
        left join employee_tbl c on a.employee_id =c.employee_id
        left join person_tbl d on c.person_id =d.person_id 
        left join work_off_status_tbl e on a.employee_id = e.employee_id and a.sequence_no = e.sequence_no 
        where
        state='Submitted' and a.golid =$1`,
        [golid],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: results.rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
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
