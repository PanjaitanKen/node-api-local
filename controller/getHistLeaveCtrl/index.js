const pool = require('../../db');

// Tabel : leave_request_tbl
const controller = {
  getHist_Leave(request, response) {
    try {
      const { employee_id, filter } = request.body;

      pool.db_MMFPROD.query(
        'select employee_id ,leave_name, ' +
          "to_char(a.leave_date_from,'DD')||' '|| " +
          " case when to_char(a.leave_date_from ,'MM')='01' then 'Jan' " +
          " when to_char(a.leave_date_from,'MM')='02' then 'Feb' " +
          " when to_char(a.leave_date_from,'MM')='03' then 'Mar' " +
          " when to_char(a.leave_date_from,'MM')='04' then 'Apr' " +
          " when to_char(a.leave_date_from,'MM')='05' then 'Mei' " +
          " when to_char(a.leave_date_from,'MM')='06' then 'Jun' " +
          " when to_char(a.leave_date_from,'MM')='07' then 'Jul' " +
          " when to_char(a.leave_date_from,'MM')='08' then 'Ags' " +
          " when to_char(a.leave_date_from,'MM')='09' then 'Sep' " +
          " when to_char(a.leave_date_from,'MM')='10' then 'Okt' " +
          " when to_char(a.leave_date_from,'MM')='11' then 'Nov' " +
          " when to_char(a.leave_date_from,'MM')='11' then 'Des' end ||' '||to_char(a.leave_date_from,'YYYY') ||' - '|| " +
          " to_char(a.leave_date_from,'DD')||' '|| " +
          " case when to_char(a.leave_date_to ,'MM')='01' then 'Jan' " +
          " when to_char(a.leave_date_to,'MM')='02' then 'Feb' " +
          " when to_char(a.leave_date_to,'MM')='03' then 'Mar' " +
          " when to_char(a.leave_date_to,'MM')='04' then 'Apr' " +
          " when to_char(a.leave_date_to,'MM')='05' then 'Mei' " +
          " when to_char(a.leave_date_to,'MM')='06' then 'Jun' " +
          " when to_char(a.leave_date_to,'MM')='07' then 'Jul' " +
          " when to_char(a.leave_date_to,'MM')='08' then 'Ags' " +
          " when to_char(a.leave_date_to,'MM')='09' then 'Sep' " +
          " when to_char(a.leave_date_to,'MM')='10' then 'Okt' " +
          " when to_char(a.leave_date_to,'MM')='11' then 'Nov' " +
          " when to_char(a.leave_date_to,'MM')='11' then 'Des' end ||' '||to_char(a.leave_date_to,'YYYY')  " +
          ' as tgl_cuti, ' +
          " to_char(a.working_date,'DD')||' '|| " +
          " case when to_char(a.working_date ,'MM')='01' then 'Jan' " +
          " when to_char(a.working_date,'MM')='02' then 'Feb' " +
          " when to_char(a.working_date,'MM')='03' then 'Mar' " +
          " when to_char(a.working_date,'MM')='04' then 'Apr' " +
          " when to_char(a.working_date,'MM')='05' then 'Mei' " +
          " when to_char(a.working_date,'MM')='06' then 'Jun' " +
          " when to_char(a.working_date,'MM')='07' then 'Jul' " +
          " when to_char(a.working_date,'MM')='08' then 'Ags' " +
          " when to_char(a.working_date,'MM')='09' then 'Sep' " +
          " when to_char(a.working_date,'MM')='10' then 'Okt' " +
          " when to_char(a.working_date,'MM')='11' then 'Nov' " +
          " when to_char(a.working_date,'MM')='11' then 'Des' end ||' '||to_char(a.working_date,'YYYY')  as tgl_kembali_kerja, " +
          ' reason as alasan_cuti, ' +
          " to_char(a.request_date ,'DD')||' '|| " +
          " case when to_char(a.request_date ,'MM')='01' then 'Jan' " +
          " when to_char(a.request_date,'MM')='02' then 'Feb' " +
          " when to_char(a.request_date,'MM')='03' then 'Mar' " +
          " when to_char(a.request_date,'MM')='04' then 'Apr' " +
          " when to_char(a.request_date,'MM')='05' then 'Mei' " +
          " when to_char(a.request_date,'MM')='06' then 'Jun' " +
          " when to_char(a.request_date,'MM')='07' then 'Jul' " +
          " when to_char(a.request_date,'MM')='08' then 'Ags' " +
          " when to_char(a.request_date,'MM')='09' then 'Sep' " +
          " when to_char(a.request_date,'MM')='10' then 'Okt' " +
          " when to_char(a.request_date,'MM')='11' then 'Nov' " +
          " when to_char(a.request_date,'MM')='11' then 'Des' end ||' '||to_char(a.request_date,'YYYY')  as tgl_pengajuan, " +
          " case when state='Approved' then 'Disetujui' " +
          " when state='Rejected' then 'Ditolak' " +
          " when state='Submitted' then 'Menunggu Persetujuan' " +
          " when state='Cancelled' then 'Batal' " +
          ' end as Status,a.golid ' +
          ' from leave_request_tbl a where employee_id =$1   ' +
          ' order by request_date desc ' +
          ' LIMIT $2 ',
        [employee_id, filter],
        (error, results) => {
          if (error) {
            throw error;
          }
          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: results.rows,
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
