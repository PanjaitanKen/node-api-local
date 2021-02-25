const pool = require('../../db');

// Tabel : emp_clocking_temp_tbl
const controller = {
  getHist_Absence(request, response) {
    try {
      const { employee_id, filter_date } = request.body;

      pool.db_MMFPROD.query(
        `select $1::text employee_id, xx.tgl_absen, xx.tgl_absen2,
        max(case when in_out='0' then to_char(yy.clocking_date ,'hh24:mi') else ' ' end ) as absen_masuk,
        max(case when in_out='1' then to_char(yy.clocking_date ,'hh24:mi') else ' ' end ) as absen_pulang,
        max(case when in_out='0' then
        (case when yy.state='Transfered' then 'Tercatat'
        when yy.state = 'Prepared' then 'Belum Tercatat'
        else 'Error' end) else 'Belum Tercatat' end ) as status_masuk,
        max(case when in_out='0' then
        (case when yy.state='Transfered' then '1'
        when yy.state = 'Prepared' then '0'
        else '2' end) else '0' end ) as status_masuk_status,
        max(case when in_out='1' then
        (case when yy.state='Transfered' then 'Tercatat'
        when yy.state = 'Prepared' then 'Belum Tercatat'
        else 'Error' end) else 'Belum Tercatat' end ) as status_pulang,
        max(case when in_out='1' then
        (case when yy.state='Transfered' then '1'
        when yy.state = 'Prepared' then '0'
        else '2' end) else '0' end ) as status_pulang_status,
        max(case when in_out='0' then transfer_message else null end ) as transfer_message_masuk,
        max(case when in_out='1' then transfer_message else null end ) as transfer_message_pulang,
        case when qq.employee_id is not null then '1' else '0' end as status_izin,
        case when rr.absence_wage is not null then '1' else '0' end as status_cuti
        from
        (select to_char(dates_this_month, 'YYYY-MM-DD')  as Tgl_absen,
        case when trim(to_char(dates_this_month,'Day'))='Sunday' then 'Minggu'
        when trim(to_char(dates_this_month,'Day'))='Monday' then 'Senin'
        when trim(to_char(dates_this_month,'Day'))='Tuesday' then 'Selasa'
        when trim(to_char(dates_this_month,'Day'))='Wednesday' then 'Rabu'
        when trim(to_char(dates_this_month,'Day'))='Thursday' then 'Kamis'
        when trim(to_char(dates_this_month,'Day'))='Friday' then 'Jumat'
        when trim(to_char(dates_this_month,'Day'))='Saturday' then 'Sabtu' else ' ' end ||', '||to_char(dates_this_month,'DD')||' '||
        case when to_char(dates_this_month,'MM')='01' then 'Jan'
        when to_char(dates_this_month,'MM')='02' then 'Feb'
        when to_char(dates_this_month,'MM')='03' then 'Mar'
        when to_char(dates_this_month,'MM')='04' then 'Apr'
        when to_char(dates_this_month,'MM')='05' then 'Mei'
        when to_char(dates_this_month,'MM')='06' then 'Jun'
        when to_char(dates_this_month,'MM')='07' then 'Jul'
        when to_char(dates_this_month,'MM')='08' then 'Ags'
        when to_char(dates_this_month,'MM')='09' then 'Sep'
        when to_char(dates_this_month,'MM')='10' then 'Okt'
        when to_char(dates_this_month,'MM')='11' then 'Nov'
        when to_char(dates_this_month,'MM')='12' then 'Des' end ||' '||to_char(dates_this_month,'YYYY') as tgl_absen2
        from (select * from generate_series(date_trunc('month',CURRENT_DATE - interval '1 months'),
        date_trunc('month',now()) + '1 month' - '1 day'::interval,'1 day') as dates_this_month
        ) a where dates_this_month between (current_date -interval '1 days' * $2) and now()
        ) xx
        left join emp_clocking_temp_tbl yy on  xx.tgl_absen=to_char(yy.clocking_date,'YYYY-MM-DD') and yy.employee_id =$1
        left join emp_clocking_tbl zz on yy.employee_id=zz.employee_id and to_char(yy.clocking_date,'YYYY-MM-DD') = to_char(zz.clocking_date,'YYYY-MM-DD')
        left join (select employee_id,clocking_date  
                from employee_work_off_tbl 
                where  employee_id = $1
                order by clocking_date desc) qq on xx.Tgl_absen=to_char(qq.clocking_date,'YYYY-MM-DD') and qq.employee_id= $1
        left join (select employee_id, clocking_date, absence_wage from 
                  emp_clocking_detail_tbl where absence_wage like 'CT_%'
         ) rr on rr.employee_id= $1 and xx.Tgl_absen=to_char(rr.clocking_date,'YYYY-MM-DD') 
        group by zz.employee_id, qq.employee_id, xx.tgl_absen, xx.tgl_absen2, rr.absence_wage
        order by xx.tgl_absen desc`,
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
