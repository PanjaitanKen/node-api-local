const pool = require('../../db')

//Tabel : emp_clocking_temp_tbl
var controller = {
    getHist_Absence: function (request, response) {
        try {
            const { employee_id, filter_date } = request.body;

            pool.db_MMFPROD.query(
                "select $1::text employee_id , xx.tgl_absen,xx.tgl_absen2, " +
                "max(case when in_out='0' then to_char(yy.clocking_date ,'hh24:mi') else ' ' end ) as absen_masuk, " +
                "max(case when in_out='1' then to_char(yy.clocking_date ,'hh24:mi') else ' ' end ) as absen_pulang, " +
                "max(case when in_out='0' then  " +
                "(case when yy.state='Transfered' then 'Tercatat' " +
                "when yy.state = 'Prepared' then 'Belum Tercatat' " +
                "else 'Error' end) else 'Belum Tercatat' end ) as status_masuk, " +
                "max(case when in_out='0' then " +
                "(case when yy.state='Transfered' then '1' " +
                "when yy.state = 'Prepared' then '0' " +
                "else '2' end) else '0' end ) as status_masuk_status, " +
                "max(case when in_out='1' then  " +
                "(case when yy.state='Transfered' then 'Tercatat' " +
                "when yy.state = 'Prepared' then 'Belum Tercatat' " +
                "else 'Error' end) else 'Belum Tercatat' end ) as status_pulang, " +
                "max(case when in_out='1' then  " +
                "(case when yy.state='Transfered' then '1' " +
                "when yy.state = 'Prepared' then '0' " +
                "else '2' end) else '0' end ) as status_pulang_status, " +
                "max(case when in_out='0' then transfer_message else null end ) as transfer_message_masuk, " +
                "max(case when in_out='1' then transfer_message else null end ) as transfer_message_pulang, " +
                "case when qq.employee_id is not null then '1' else '0' end as status_izin "+
                "from  " +
                "(select to_char(dates_this_month, 'YYYY-MM-DD')  as Tgl_absen,  " +
                "case when trim(to_char(dates_this_month,'Day'))='Sunday' then 'Minggu' " +
                "when trim(to_char(dates_this_month,'Day'))='Monday' then 'Senin' " +
                "when trim(to_char(dates_this_month,'Day'))='Tuesday' then 'Selasa' " +
                "when trim(to_char(dates_this_month,'Day'))='Wednesday' then 'Rabu' " +
                "when trim(to_char(dates_this_month,'Day'))='Thursday' then 'Kamis' " +
                "when trim(to_char(dates_this_month,'Day'))='Friday' then 'Jumat' " +
                "when trim(to_char(dates_this_month,'Day'))='Saturday' then 'Sabtu' else ' ' end ||', '||to_char(dates_this_month,'DD')||' '|| " +
                "case when to_char(dates_this_month,'MM')='01' then 'Jan' " +
                "when to_char(dates_this_month,'MM')='02' then 'Feb' " +
                "when to_char(dates_this_month,'MM')='03' then 'Mar' " +
                "when to_char(dates_this_month,'MM')='04' then 'Apr' " +
                "when to_char(dates_this_month,'MM')='05' then 'Mei' " +
                "when to_char(dates_this_month,'MM')='06' then 'Jun' " +
                "when to_char(dates_this_month,'MM')='07' then 'Jul' " +
                "when to_char(dates_this_month,'MM')='08' then 'Ags' " +
                "when to_char(dates_this_month,'MM')='09' then 'Sep' " +
                "when to_char(dates_this_month,'MM')='10' then 'Okt' " +
                "when to_char(dates_this_month,'MM')='11' then 'Nov' " +
                "when to_char(dates_this_month,'MM')='12' then 'Des' end ||' '||to_char(dates_this_month,'YYYY') as tgl_absen2 " +
                "from ( " +
                "select * from generate_series(date_trunc('month',now()), " +
                "date_trunc('month',now()) + '1 month' - '1 day'::interval,'1 day') as dates_this_month " +
                ") a 	where dates_this_month between (current_date -interval '1 days' * $2) and now() " +
                ") xx " +
                "left join emp_clocking_temp_tbl yy on  xx.tgl_absen=to_char(yy.clocking_date,'YYYY-MM-DD') and yy.employee_id =$1 " +
                "left join emp_clocking_tbl zz on yy.employee_id=zz.employee_id and to_char(yy.clocking_date,'YYYY-MM-DD') = to_char(zz.clocking_date,'YYYY-MM-DD') " +
                "left join (select employee_id ,clocking_date ,to_char(work_off_from ,'HH24:MM') jam_ijin_dari, "+
                          " to_char(work_off_to ,'HH24:MM') jam_ijin_sd "+
                          " from employee_work_off_tbl)	qq on yy.employee_id = qq.employee_id and to_char(yy.clocking_date,'YYYY-MM-DD')=to_char(qq.clocking_date,'YYYY-MM-DD') "+
                "group by zz.employee_id, qq.employee_id, xx.tgl_absen, xx.tgl_absen2 " +
                "order by xx.tgl_absen desc"
                , [employee_id, filter_date], (error, results) => {
                    if (error) {
                        throw error
                    }
                    if (results.rows != '') {
                        response.status(200).send({
                            status: 200,
                            message: 'Load Data berhasil',
                            data: results.rows
                        });
                    } else {
                        response.status(200).send({
                            status: 200,
                            message: 'Data Tidak Ditemukan',
                            data: results.rows
                        });
                    }
                })
        } catch (err) {
            res.status(500).send(err);
        }
    }
};

module.exports = controller;