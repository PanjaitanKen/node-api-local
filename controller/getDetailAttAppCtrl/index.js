const pool = require('../../db');

// Tabel : employeeworkofftbl, wagecodetbl, employeetbl, person_tbl
const controller = {
  async getDetail_Att_App(request, response) {
    try {
      const { golid } = request.body;

      const query = `select a.employee_id, initcap(a.leave_name)  as jenis_cuti, initcap(d.display_name) as nama,
        to_char(leave_date_from,'MM-DD-YYYY') as tgl_cuti_dr, to_char(leave_date_to,'MM-DD-YYYY') as tgl_cuti_sd,
        reason as alasan,TO_CHAR(a.request_date,'MM-DD-YYYY') as tgl_pengajuan,a.golid,
        case when a.state='Approved' then 'Disetujui'
        when a.state='Rejected' then 'Ditolak'
        when a.state='Submitted' then 'Menunggu Persetujuan'
        when a.state='Cancelled' then 'Batal' end as Status,
        TO_CHAR(a.working_date,'MM-DD-YYYY') as tgl_bekerja_kembali,
        case when a.leave_name in ('CUTI MELAHIRKAN','CUTI KEGUGURAN')
        then CAST(request_days AS INT)||' Bulan' else CAST(request_days AS INT)||' Hari' end
        as lama_cuti, a.employee_id||'/'||to_char(a.request_Date,'YYYYMMDD')||'/'||trim(to_char(a.sequence_no,'9999999999999999')) as nobukti  
        from leave_request_tbl a left join employee_tbl c on a.employee_id =c.employee_id
        left join person_tbl d on c.person_id =d.person_id where state='Submitted' and a.golid =$1`;

      await pool.db_MMFPROD
        .query(query, [golid])
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
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
