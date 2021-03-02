const pool = require('../../db');

// Tabel : employeeworkofftbl, leaverequest_tbl
const controller = {
  getListJobTask(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_MMFPROD.query(
        "select 'Persetujuan Izin' Keterangan,initcap(c.display_name) nama , " +
          " case  when current_date-clocking_date=0 then 'Hari ini' " +
          " when current_date-clocking_date=1 then 'Kemarin'  " +
          " when current_date-clocking_date=2 then '2 Hari yang lalu'  " +
          " when current_date-clocking_date=3 then '3 Hari yang lalu'  " +
          " when current_date-clocking_Date=4 then '4 Hari yang lalu'  " +
          " when current_date-clocking_Date=5 then '5 Hari yang lalu'  " +
          " when current_date-clocking_Date=6 then '6 Hari yang lalu'  " +
          " when current_date-clocking_Date=7 then '7 Hari yang lalu'  " +
          " when current_date-clocking_Date>7 then to_char(clocking_date,'DD Mon YYYY') end Durasi_Waktu , " +
          " a.golid,'Pengajuan Ijin' Keterangan2  " +
          ' from employee_work_off_tbl a  ' +
          ' left join employee_tbl  b on a.employee_id = b.employee_id  ' +
          ' left join person_tbl c on b.person_id =c.person_id  ' +
          " where a.state='Submitted'  " +
          " and a.employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id =$1 and valid_to=date'9999-01-01') " +
          ' union all  ' +
          " select 'Persetujuan Cuti' Keterangan,initcap(c.display_name) nama,  " +
          " case  when current_date-request_date=0 then 'Hari ini'  " +
          " when current_date-request_date=1 then 'Kemarin'  " +
          " when current_date-request_date=2 then '2 Hari yang lalu'  " +
          " when current_date-request_date=3 then '3 Hari yang lalu'  " +
          " when current_date-request_date=4 then '4 Hari yang lalu' " +
          " when current_date-request_date=5 then '5 Hari yang lalu'  " +
          " when current_date-request_date=6 then '6 Hari yang lalu' " +
          " when current_date-request_date=7 then '7 Hari yang lalu' " +
          " when current_date-request_date>7 then to_char(request_date,'DD Mon YYYY') end Durasi_Waktu ," +
          " a.golid,'Pengajuan Cuti' Keterangan2 from leave_request_tbl  a " +
          ' left join employee_tbl  b on a.employee_id = b.employee_id  ' +
          ' left join person_tbl c on b.person_id =c.person_id ' +
          " where a.state='Submitted'  " +
          " and  a.employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id = $1 and valid_to=date'9999-01-01') " +
          ' union all  ' +
          " select 'Persetujuan Perjalanan Dinas' Keterangan,initcap(c.display_name) nama,  " +
          " case  when current_date-request_date=0 then 'Hari ini'  " +
          " when current_date-request_date=1 then 'Kemarin'  " +
          " when current_date-request_date=2 then '2 Hari yang lalu'  " +
          " when current_date-request_date=3 then '3 Hari yang lalu'  " +
          " when current_date-request_date=4 then '4 Hari yang lalu'  " +
          " when current_date-request_date=5 then '5 Hari yang lalu'  " +
          " when current_date-request_date=6 then '6 Hari yang lalu'  " +
          " when current_date-request_date=7 then '7 Hari yang lalu'  " +
          " when current_date-request_date>7 then to_char(request_date,'DD Mon YYYY') end Durasi_Waktu , " +
          " a.golid,'Pengajuan Perjalanan Dinas' Keterangan2 from travel_request_tbl  a  " +
          ' left join employee_tbl  b on a.employee_id = b.employee_id  ' +
          ' left join person_tbl c on b.person_id =c.person_id ' +
          " where a.state='Submitted'  " +
          " and  a.employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id = $1 and valid_to=date'9999-01-01') ",
        [employee_id],
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
