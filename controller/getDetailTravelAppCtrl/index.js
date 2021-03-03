const pool = require('../../db');

// Tabel : travel_request_tbl, travel_request_destination_tbl
const controller = {
  getDetail_Travel_App(request, response) {
    try {
      const { golid } = request.body;

      pool.db_MMFPROD.query(
        " select a.employee_id, a.request_no nobukti, coalesce(b.pcx_purpose||' - '|| b.destination,' - ') as keperluan, " +
          " to_char(b.start_date,'DD')||' '||  " +
          " case when to_char(b.start_date,'MM')='01' then 'Jan' " +
          " when to_char(b.start_date,'MM')='02' then 'Feb'  " +
          " when to_char(b.start_date,'MM')='03' then 'Mar'  " +
          " when to_char(b.start_date,'MM')='04' then 'Apr'  " +
          " when to_char(b.start_date,'MM')='05' then 'Mei'  " +
          " when to_char(b.start_date,'MM')='06' then 'Jun'  " +
          " when to_char(b.start_date,'MM')='07' then 'Jul'  " +
          " when to_char(b.start_date,'MM')='08' then 'Ags'  " +
          " when to_char(b.start_date,'MM')='09' then 'Sep'  " +
          " when to_char(b.start_date,'MM')='10' then 'Okt'  " +
          " when to_char(b.start_date,'MM')='11' then 'Nov'  " +
          " when to_char(b.start_date,'MM')='12' then 'Des' end ||' '||to_char(b.start_date,'YYYY') as tgl_dari, " +
          " to_char(b.end_date,'DD')||' '||  " +
          " case when to_char(b.end_date,'MM')='01' then 'Jan'  " +
          " when to_char(b.end_date,'MM')='02' then 'Feb'  " +
          " when to_char(b.end_date,'MM')='03' then 'Mar'  " +
          " when to_char(b.end_date,'MM')='04' then 'Apr'  " +
          " when to_char(b.end_date,'MM')='05' then 'Mei'  " +
          " when to_char(b.end_date,'MM')='06' then 'Jun'  " +
          " when to_char(b.end_date,'MM')='07' then 'Jul' " +
          " when to_char(b.end_date,'MM')='08' then 'Ags'  " +
          " when to_char(b.end_date,'MM')='09' then 'Sep'  " +
          " when to_char(b.end_date,'MM')='10' then 'Okt'  " +
          " when to_char(b.end_date,'MM')='11' then 'Nov' " +
          " when to_char(b.end_date,'MM')='12' then 'Des' end ||' '||to_char(b.end_date,'YYYY') as tgl_sampai, coalesce(destination,'-') as tujuan, " +
          " coalesce(pcx_note,'-') as keterangan , " +
          " to_char(a.request_date,'DD')||' '||   " +
          " case when to_char(a.request_date,'MM')='01' then 'Jan'   " +
          " when to_char(a.request_date,'MM')='02' then 'Feb'   " +
          " when to_char(a.request_date,'MM')='03' then 'Mar'   " +
          " when to_char(a.request_date,'MM')='04' then 'Apr'   " +
          " when to_char(a.request_date,'MM')='05' then 'Mei'   " +
          " when to_char(a.request_date,'MM')='06' then 'Jun'   " +
          " when to_char(a.request_date,'MM')='07' then 'Jul'  " +
          " when to_char(a.request_date,'MM')='08' then 'Ags'   " +
          " when to_char(a.request_date,'MM')='09' then 'Sep'   " +
          " when to_char(a.request_date,'MM')='10' then 'Okt'  " +
          " when to_char(a.request_date,'MM')='11' then 'Nov'  " +
          " when to_char(a.request_date,'MM')='12' then 'Des' end ||' '||to_char(a.request_date,'YYYY') as tgl_pengajuan, " +
          " case when a.state='Approved' then 'Disetujui' " +
          " when state='Rejected' then 'Ditolak' " +
          " when state='Submitted' then 'Menunggu Persetujuan'  " +
          " when state='Cancelled' then 'Batal' end as Status ,d.display_name as nama " +
          ' from travel_request_tbl a  ' +
          ' left join travel_request_destination_tbl b on a.company_id = b.company_id and a.employee_id =b.employee_id and a.request_no =b.request_no  ' +
          ' left join employee_tbl c on a.employee_id =c.employee_id ' +
          ' left join person_tbl d on c.person_id =d.person_id ' +
          ' where a.golid = $1  ',
        [golid],
        (error, results) => {
          if (error) throw error;

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
