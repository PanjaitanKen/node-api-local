const pool = require('../../db');

// Tabel : emp_clocking_temp_tbl
const controller = {
  getHist_Detail_Absence(request, response) {
    try {
      const { employee_id, clocking_date } = request.body;

      pool.db_MMFPROD.query(
        `select $1 employee_id, to_char(xx.dates_this_month,'YYYY-MM-DD')  as tgl_absen,
        case when trim(to_char(xx.dates_this_month,'Day'))='Sunday' then 'Minggu'
        when trim(to_char(xx.dates_this_month,'Day'))='Monday' then 'Senin'
        when trim(to_char(xx.dates_this_month,'Day'))='Tuesday' then 'Selasa'
        when trim(to_char(xx.dates_this_month,'Day'))='Wednesday' then 'Rabu'
        when trim(to_char(xx.dates_this_month,'Day'))='Thursday' then 'Kamis'
        when trim(to_char(xx.dates_this_month,'Day'))='Friday' then 'Jumat'
        when trim(to_char(xx.dates_this_month,'Day'))='Saturday' then 'Sabtu' else ' ' end ||', '||to_char(xx.dates_this_month,'DD')||' '||
        case when to_char(xx.dates_this_month,'MM')='01' then 'Jan'
        when to_char(xx.dates_this_month,'MM')='02' then 'Feb'
        when to_char(xx.dates_this_month,'MM')='03' then 'Mar'
        when to_char(xx.dates_this_month,'MM')='04' then 'Apr'
        when to_char(xx.dates_this_month,'MM')='05' then 'Mei'
        when to_char(xx.dates_this_month,'MM')='06' then 'Jun'
        when to_char(xx.dates_this_month,'MM')='07' then 'Jul'
        when to_char(xx.dates_this_month,'MM')='08' then 'Ags'
        when to_char(xx.dates_this_month,'MM')='09' then 'Sep'
        when to_char(xx.dates_this_month,'MM')='10' then 'Okt'
        when to_char(xx.dates_this_month,'MM')='11' then 'Nov'
        when to_char(xx.dates_this_month,'MM')='12' then 'Des' end ||' '||to_char(xx.dates_this_month,'YYYY') as tgl_absen2,
        case when in_out='0' then 'Absen Masuk' when in_out='1' then 'Absen Pulang'  else ' ' end as kategori,
        to_char(yy.clocking_date,'HH24:MI')  as jam,
        case when  yy.state='Transfered' then '1' else '0' end as status,
        case when in_out='1' then '1' else '0' end as type_absen,
        case when b.clocking_date is null then '0' else '1' end as type_ijin,
        coalesce(to_char(b.work_off_from ,'HH24:MI')||' - '||to_char(b.work_off_to ,'HH24:MI'),' ') jam_ijin ,
        case when c.absence_wage is not null then '1' else '0' end as type_cuti
        from
        (select * from 
          (select * from generate_series(date_trunc('month',CURRENT_DATE - interval '1 months'),
           date_trunc('month',now()) + '1 month' - '1 day'::interval,'1 day') as dates_this_month) a 
           where dates_this_month between (current_date -interval '1 days' * 90) and now()
        ) xx
        left join emp_clocking_temp_tbl yy on to_char(xx.dates_this_month,'YYYY-MM-DD') = to_char(yy.clocking_date,'YYYY-MM-DD')  and yy.employee_id =$1
        left join employee_work_off_tbl b on b.employee_id= $1  and xx.dates_this_month =b.clocking_date  and b.state ='Approved'
        left join (select employee_id, clocking_date, absence_wage from 
                  emp_clocking_detail_tbl where absence_wage like 'CT_%'
                  ) c on c.employee_id= $1 and to_char(xx.dates_this_month,'YYYY-MM-DD')=to_char(c.clocking_date,'YYYY-MM-DD') 
    
        where
        to_char(xx.dates_this_month,'YYYY-MM-DD') = $2
        order by yy.clocking_date desc
        `,
        [employee_id, clocking_date],
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
