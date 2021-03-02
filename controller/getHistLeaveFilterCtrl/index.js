const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  get_Hist_Leave_Filter(request, response) {
    try {
      const { employee_id, jenis_cuti, waktu } = request.body;
      pool.db_MMFPROD.query(
        `select employee_id ,leave_name,
        to_char(a.leave_date_from,'DD')||' '||
        case when to_char(a.leave_date_from ,'MM')='01' then 'Jan'
        when to_char(a.leave_date_from,'MM')='02' then 'Feb'
        when to_char(a.leave_date_from,'MM')='03' then 'Mar'
        when to_char(a.leave_date_from,'MM')='04' then 'Apr'
        when to_char(a.leave_date_from,'MM')='05' then 'Mei'
        when to_char(a.leave_date_from,'MM')='06' then 'Jun'
        when to_char(a.leave_date_from,'MM')='07' then 'Jul'
        when to_char(a.leave_date_from,'MM')='08' then 'Ags'
        when to_char(a.leave_date_from,'MM')='09' then 'Sep'
        when to_char(a.leave_date_from,'MM')='10' then 'Okt'
        when to_char(a.leave_date_from,'MM')='11' then 'Nov'
        when to_char(a.leave_date_from,'MM')='12' then 'Des' end ||' '||to_char(a.leave_date_from,'YYYY') ||' - '||
        to_char(a.leave_date_from,'DD')||' '||
        case when to_char(a.leave_date_to ,'MM')='01' then 'Jan'
        when to_char(a.leave_date_to,'MM')='02' then 'Feb'
        when to_char(a.leave_date_to,'MM')='03' then 'Mar'
        when to_char(a.leave_date_to,'MM')='04' then 'Apr'
        when to_char(a.leave_date_to,'MM')='05' then 'Mei'
        when to_char(a.leave_date_to,'MM')='06' then 'Jun'
        when to_char(a.leave_date_to,'MM')='07' then 'Jul'
        when to_char(a.leave_date_to,'MM')='08' then 'Ags'
        when to_char(a.leave_date_to,'MM')='09' then 'Sep'
        when to_char(a.leave_date_to,'MM')='10' then 'Okt'
        when to_char(a.leave_date_to,'MM')='11' then 'Nov'
        when to_char(a.leave_date_to,'MM')='12' then 'Des' end ||' '||to_char(a.leave_date_to,'YYYY') 
        as tgl_cuti,
        to_char(a.working_date,'DD')||' '||
        case when to_char(a.working_date ,'MM')='01' then 'Jan'
        when to_char(a.working_date,'MM')='02' then 'Feb'
        when to_char(a.working_date,'MM')='03' then 'Mar'
        when to_char(a.working_date,'MM')='04' then 'Apr'
        when to_char(a.working_date,'MM')='05' then 'Mei'
        when to_char(a.working_date,'MM')='06' then 'Jun'
        when to_char(a.working_date,'MM')='07' then 'Jul'
        when to_char(a.working_date,'MM')='08' then 'Ags'
        when to_char(a.working_date,'MM')='09' then 'Sep'
        when to_char(a.working_date,'MM')='10' then 'Okt'
        when to_char(a.working_date,'MM')='11' then 'Nov'
        when to_char(a.working_date,'MM')='12' then 'Des' end ||' '||to_char(a.working_date,'YYYY')  as tgl_kembali_kerja,
        reason as alasan_cuti,
        to_char(a.request_date ,'DD')||' '||
        case when to_char(a.request_date ,'MM')='01' then 'Jan'
        when to_char(a.request_date,'MM')='02' then 'Feb'
        when to_char(a.request_date,'MM')='03' then 'Mar'
        when to_char(a.request_date,'MM')='04' then 'Apr'
        when to_char(a.request_date,'MM')='05' then 'Mei'
        when to_char(a.request_date,'MM')='06' then 'Jun'
        when to_char(a.request_date,'MM')='07' then 'Jul'
        when to_char(a.request_date,'MM')='08' then 'Ags'
        when to_char(a.request_date,'MM')='09' then 'Sep'
        when to_char(a.request_date,'MM')='10' then 'Okt'
        when to_char(a.request_date,'MM')='11' then 'Nov'
        when to_char(a.request_date,'MM')='12' then 'Des' end ||' '||to_char(a.request_date,'YYYY')  as tgl_pengajuan,
        case when state='Approved' then 'Disetujui'
             when state='Rejected' then 'Ditolak'
             when state='Submitted' then 'Menunggu Persetujuan'
             when state='Cancelled' then 'Batal'
        end as Status,a.golid, a.request_days as cuti_diambil
        from leave_request_tbl a where employee_id =$3 
        and a.request_date between (current_date -interval '1 days' * $1 ) and now()
        and a.leave_name = ANY($2)
        order by leave_date_from desc`,
        [waktu, jenis_cuti, employee_id],
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
