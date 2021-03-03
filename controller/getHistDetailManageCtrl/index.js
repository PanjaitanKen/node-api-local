const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getHistDetailManage(request, response) {
    try {
      const { employee_id, golid } = request.body;

      pool.db_MMFPROD.query(
        `with x as ( 
          select a.employee_id , trim(to_char(b.sequence_no,'9999999999999999')) as no_urut,  initcap(d.display_name) nama, initcap(a.leave_name) as Jenis,
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
            when to_char(a.leave_date_from,'MM')='11' then 'Des' end ||' '||to_char(a.leave_date_from,'YYYY') ||' - '||
            to_char(a.leave_date_to,'DD')||' '||
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
              when to_char(a.leave_date_to,'MM')='11' then 'Des' end ||' '||to_char(a.leave_date_to,'YYYY') tanggal , ' ' waktu,
              leave_balance as cuti_diambil, a.reason as alasan, 
              
              to_char(a.request_date,'DD')||' '||
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
              when to_char(a.request_date,'MM')='11' then 'Des' end ||' '||to_char(a.request_date,'YYYY') tgl_pengajuan,
              to_char(b.status_date,'DD')||' '||
              case when to_char(b.status_date ,'MM')='01' then 'Jan'
              when to_char(b.status_date,'MM')='02' then 'Feb'
              when to_char(b.status_date,'MM')='03' then 'Mar'
              when to_char(b.status_date,'MM')='04' then 'Apr'
              when to_char(b.status_date,'MM')='05' then 'Mei'
              when to_char(b.status_date,'MM')='06' then 'Jun'
              when to_char(b.status_date,'MM')='07' then 'Jul'
              when to_char(b.status_date,'MM')='08' then 'Ags'
              when to_char(b.status_date,'MM')='09' then 'Sep'
              when to_char(b.status_date,'MM')='10' then 'Okt'
              when to_char(b.status_date,'MM')='11' then 'Nov'
              when to_char(b.status_date,'MM')='11' then 'Des' end ||' '||to_char(b.status_date,'YYYY') tgl_status,
            case when state='Approved' then 'Disetujui'
                 when state='Rejected' then 'Ditolak'
                 when state='Submitted' then 'Menunggu Persetujuan'
                 when state='Cancelled' then 'Batal'
        end as Status,a.golid,
        a.employee_id||'/'||to_char(b.status_date,'YYYYMMDD')||'/'||trim(to_char(b.sequence_no,'9999999999999999')) as nobukti 
          from leave_request_tbl a
          left join l_r_status_history_tbl b on a.employee_id =b.employee_id and a.sequence_no = b.sequence_no  and b.status<>'Submitted'
          left join employee_tbl  c on a.employee_id = c.employee_id 
          left join person_tbl d on c.person_id =d.person_id 
          where  state not in ('Submitted')  and 
        a.employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id = $1
        and valid_to=date'9999-01-01') 
          
          union all 
          
          select a.employee_id,  trim(to_char(b.sequence_no,'9999999999999999')) as no_urut, initcap(d.display_name) nama, initcap(e.wage_name ) as Jenis,
          case when to_char(a.work_off_from ,'MM')='01' then 'Jan'
            when to_char(a.work_off_from,'MM')='02' then 'Feb'
            when to_char(a.work_off_from,'MM')='03' then 'Mar'
            when to_char(a.work_off_from,'MM')='04' then 'Apr'
            when to_char(a.work_off_from,'MM')='05' then 'Mei'
            when to_char(a.work_off_from,'MM')='06' then 'Jun'
            when to_char(a.work_off_from,'MM')='07' then 'Jul'
            when to_char(a.work_off_from,'MM')='08' then 'Ags'
            when to_char(a.work_off_from,'MM')='09' then 'Sep'
            when to_char(a.work_off_from,'MM')='10' then 'Okt'
            when to_char(a.work_off_from,'MM')='11' then 'Nov'
            when to_char(a.work_off_from,'MM')='11' then 'Des' end ||' '||to_char(a.work_off_from,'YYYY') ||' - '||
            to_char(a.work_off_to,'DD')||' '||
            case when to_char(a.work_off_to ,'MM')='01' then 'Jan'
              when to_char(a.work_off_to,'MM')='02' then 'Feb'
              when to_char(a.work_off_to,'MM')='03' then 'Mar'
              when to_char(a.work_off_to,'MM')='04' then 'Apr'
              when to_char(a.work_off_to,'MM')='05' then 'Mei'
              when to_char(a.work_off_to,'MM')='06' then 'Jun'
              when to_char(a.work_off_to,'MM')='07' then 'Jul'
              when to_char(a.work_off_to,'MM')='08' then 'Ags'
              when to_char(a.work_off_to,'MM')='09' then 'Sep'
              when to_char(a.work_off_to,'MM')='10' then 'Okt'
              when to_char(a.work_off_to,'MM')='11' then 'Nov'
              when to_char(a.work_off_to,'MM')='11' then 'Des' end ||' '||to_char(a.work_off_to,'YYYY') tanggal ,
              work_off_from::timestamp::time ||' - '||work_off_to::timestamp::time Waktu, 0 as cuti_diambil,a.reason as alasan,
              to_char(a.clocking_date,'DD')||' '||
              case when to_char(a.clocking_date ,'MM')='01' then 'Jan'
              when to_char(a.clocking_date,'MM')='02' then 'Feb'
              when to_char(a.clocking_date,'MM')='03' then 'Mar'
              when to_char(a.clocking_date,'MM')='04' then 'Apr'
              when to_char(a.clocking_date,'MM')='05' then 'Mei'
              when to_char(a.clocking_date,'MM')='06' then 'Jun'
              when to_char(a.clocking_date,'MM')='07' then 'Jul'
              when to_char(a.clocking_date,'MM')='08' then 'Ags'
              when to_char(a.clocking_date,'MM')='09' then 'Sep'
              when to_char(a.clocking_date,'MM')='10' then 'Okt'
              when to_char(a.clocking_date,'MM')='11' then 'Nov'
              when to_char(a.clocking_date,'MM')='11' then 'Des' end ||' '||to_char(a.clocking_date,'YYYY') tgl_pengajuan,
              to_char(b.status_date ,'DD')||' '||
              case when to_char(b.status_date ,'MM')='01' then 'Jan'
              when to_char(b.status_date,'MM')='02' then 'Feb'
              when to_char(b.status_date,'MM')='03' then 'Mar'
              when to_char(b.status_date,'MM')='04' then 'Apr'
              when to_char(b.status_date,'MM')='05' then 'Mei'
              when to_char(b.status_date,'MM')='06' then 'Jun'
              when to_char(b.status_date,'MM')='07' then 'Jul'
              when to_char(b.status_date,'MM')='08' then 'Ags'
              when to_char(b.status_date,'MM')='09' then 'Sep'
              when to_char(b.status_date,'MM')='10' then 'Okt'
              when to_char(b.status_date,'MM')='11' then 'Nov'
              when to_char(b.status_date,'MM')='11' then 'Des' end ||' '||to_char(b.status_date,'YYYY') tgl_status,
              case when state='Approved' then 'Disetujui'
                 when state='Rejected' then 'Ditolak'
                 when state='Submitted' then 'Menunggu Persetujuan'
                 when state='Cancelled' then 'Batal'
        end as Status, a.golid,  a.employee_id||'/'||to_char(b.status_date,'YYYYMMDD')||'/'||trim(to_char(b.sequence_no,'9999999999999999')) as nobukti 
          from employee_work_off_tbl  a
          left join l_r_status_history_tbl b on a.employee_id =b.employee_id and a.sequence_no = b.sequence_no  and b.status<>'Submitted'
          left join employee_tbl  c on a.employee_id = c.employee_id 
          left join person_tbl d on c.person_id =d.person_id 
          left join wage_code_tbl e on a.absence_wage =e.wage_code 
          where  state not in ('Submitted')   and 
        a.employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id = $1
        and valid_to=date'9999-01-01') 
          
        ) select * from x
        where golid = $2
        order by tgl_status desc , no_urut desc`,
        [employee_id, golid],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: results.rows[0],
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
