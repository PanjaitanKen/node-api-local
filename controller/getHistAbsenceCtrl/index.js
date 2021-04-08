const pool = require('../../db');

// Tabel : emp_clocking_temp_tbl
const controller = {
  getHist_Absence(request, response) {
    try {
      const { employee_id, filter_date } = request.body;

      pool.db_MMFPROD.query(
        ' select  $1::text employee_id , xx.tgl_absen, xx.tgl_absen2, ' +
          " coalesce(ss.absen_masuk,' ') absen_masuk, coalesce(ss.absen_pulang,' ') absen_pulang, " +
          " max(case when in_out='0' then " +
          " (case when sss.state='Transfered' then 'Tercatat' " +
          " when sss.state = 'Prepared' then 'Belum Tercatat' " +
          " else 'Error' end) else 'Belum Tercatat' end ) as status_masuk, " +
          " max(case when in_out='0' then " +
          " (case when sss.state='Transfered' then '1' " +
          " when sss.state = 'Prepared' then '0' " +
          " else '2' end) else '0' end ) as status_masuk_status, " +
          " max(case when in_out='1' then " +
          " (case when yy.state='Transfered' then 'Tercatat' " +
          " when yy.state = 'Prepared' then 'Belum Tercatat' " +
          " else 'Error' end) else 'Belum Tercatat' end ) as status_pulang, " +
          " max(case when in_out='1' then " +
          " (case when yy.state='Transfered' then '1' " +
          " when yy.state = 'Prepared' then '0' " +
          " else '2' end) else '0' end ) as status_pulang_status, " +
          ' sss.transfer_message_masuk, ' +
          " max(case when in_out='1' then transfer_message else null end ) as transfer_message_pulang, " +
          " case when qq.employee_id is not null then '1' else '0' end as status_izin, " +
          " case when rr.absence_wage is not null then '1' else '0' end as status_cuti, " +
          " case when tt.employee_id is not null then '1' else '0' end as status_PD " +
          ' from ' +
          " (select to_char(dates_this_month, 'YYYY-MM-DD')  as Tgl_absen, " +
          " case when trim(to_char(dates_this_month,'Day'))='Sunday' then 'Minggu' " +
          " when trim(to_char(dates_this_month,'Day'))='Monday' then 'Senin' " +
          " when trim(to_char(dates_this_month,'Day'))='Tuesday' then 'Selasa' " +
          " when trim(to_char(dates_this_month,'Day'))='Wednesday' then 'Rabu' " +
          " when trim(to_char(dates_this_month,'Day'))='Thursday' then 'Kamis' " +
          " when trim(to_char(dates_this_month,'Day'))='Friday' then 'Jumat' " +
          " when trim(to_char(dates_this_month,'Day'))='Saturday' then 'Sabtu' else ' ' end ||', '||to_char(dates_this_month,'DD')||' '|| " +
          " case when to_char(dates_this_month,'MM')='01' then 'Jan' " +
          " when to_char(dates_this_month,'MM')='02' then 'Feb' " +
          " when to_char(dates_this_month,'MM')='03' then 'Mar' " +
          " when to_char(dates_this_month,'MM')='04' then 'Apr' " +
          " when to_char(dates_this_month,'MM')='05' then 'Mei' " +
          " when to_char(dates_this_month,'MM')='06' then 'Jun' " +
          " when to_char(dates_this_month,'MM')='07' then 'Jul' " +
          " when to_char(dates_this_month,'MM')='08' then 'Ags' " +
          " when to_char(dates_this_month,'MM')='09' then 'Sep' " +
          " when to_char(dates_this_month,'MM')='10' then 'Okt' " +
          " when to_char(dates_this_month,'MM')='11' then 'Nov' " +
          " when to_char(dates_this_month,'MM')='12' then 'Des' end ||' '||to_char(dates_this_month,'YYYY') as tgl_absen2  " +
          " from (select * from generate_series(date_trunc('month',CURRENT_DATE - interval '1 months'), " +
          " date_trunc('month',now()) + '1 month' - '1 day'::interval,'1 day') as dates_this_month " +
          " ) a where dates_this_month between (current_date -interval '1 days' * $2) and now() " +
          ' ) xx ' +
          " left join emp_clocking_temp_tbl yy on  xx.tgl_absen=to_char(yy.clocking_date,'YYYY-MM-DD') and yy.employee_id =$1 " +
          " left join emp_clocking_tbl zz on yy.employee_id=zz.employee_id and to_char(yy.clocking_date,'YYYY-MM-DD') = to_char(zz.clocking_date,'YYYY-MM-DD') " +
          ' left join (select employee_id,clocking_date, state  ' +
          ' from employee_work_off_tbl where  ' +
          ' employee_id = $1 ' +
          " order by clocking_date desc) qq on xx.Tgl_absen=to_char(qq.clocking_date,'YYYY-MM-DD') and qq.employee_id= $1  and qq.state='Approved' " +
          ' left join (select employee_id, clocking_date, absence_wage from  ' +
          " emp_clocking_detail_tbl where absence_wage like 'CT_%' " +
          ") rr on rr.employee_id= $1 and xx.Tgl_absen=to_char(rr.clocking_date,'YYYY-MM-DD') " +
          ' left join ( ' +
          ' with x as ( ' +
          "  select employee_id ,'absen_masuk' as tipe, to_char(clocking_date ,'YYYY-MM-DD') clocking_date,  " +
          "  min(to_char(clocking_date ,'HH24:MI'))  jam " +
          " from emp_clocking_temp_tbl where employee_id =$1  and in_out='0' " +
          " group by employee_id ,to_char(clocking_date ,'YYYY-MM-DD') " +
          '  union all ' +
          "  select employee_id ,'absen_pulang' as tipe, to_char(clocking_date ,'YYYY-MM-DD') clocking_date,  " +
          "  max(to_char(clocking_date ,'HH24:MI'))  jam " +
          "  from emp_clocking_temp_tbl where employee_id =$1  and in_out='1' " +
          "  group by employee_id ,to_char(clocking_date ,'YYYY-MM-DD') " +
          '  ) select employee_id ,clocking_date , ' +
          "  max(case when tipe = 'absen_masuk' then jam else ' ' end) absen_masuk, " +
          "  max(case when tipe = 'absen_pulang' then jam else ' ' end) absen_pulang " +
          '  from x ' +
          ' group by employee_id ,clocking_date  ' +
          ' order by clocking_date desc ' +
          ' ) ss on xx.Tgl_absen=ss.clocking_date and ss.employee_id= $1 ' +
          ' left join ' +
          " (select employee_id ,to_char(clocking_date ,'YYYY-MM-DD') clocking_date,to_char(clocking_date ,'HH24:MI') jam,state, " +
          ' transfer_message  as transfer_message_masuk ' +
          " from emp_clocking_temp_tbl where in_out='0' and employee_id= $1 ) sss on sss.employee_id =$1 " +
          ' and ss.clocking_date = sss.clocking_date and ss.absen_masuk = sss.jam	' +
          ' left join ' +
          " (select a.employee_id ,a.request_no ,to_char(b.start_date,'YYYY-MM-DD') tgl_pd " +
          ' from travel_request_tbl a ' +
          ' left join travel_request_destination_tbl b on a.request_no =b.request_no ' +
          ' where a.employee_id = $1 ' +
          " and state in ('Approved','Partially Approved')) tt on tt.employee_id= $1 and tt.tgl_pd = xx.Tgl_absen " +
          'group by zz.employee_id, qq.employee_id, xx.tgl_absen, xx.tgl_absen2, rr.absence_wage,ss.absen_masuk,ss.absen_pulang, tt.employee_id , ' +
          'sss.transfer_message_masuk ' +
          ' order by xx.tgl_absen desc ',
        [employee_id, filter_date],
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
