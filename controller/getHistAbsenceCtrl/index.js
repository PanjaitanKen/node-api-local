const pool = require('../../db')

//Tabel : emp_clocking_temp_tbl
var controller = {
    getHist_Absence: function (request, response) {
        try {
            const { employee_id,filter_date } = request.body;

            pool.db_MMFPROD.query(
                "select $1::text as employee_id,ss.tgl_absen,ss.tgl_absen2, " +
                "case when zz.employee_id is null then 'Belum Tercatat' else xx.kategori end as kategori ,xx.jam, " +
                "case when yy.state='Transfered' then 'Tercatat' " +
                "when yy.state = 'prepared' then 'Belum Tercatat' " +
                "else 'Error' end as status,yy.transfer_message, " +
                "case when zz.employee_id is null " +
                "then 'Data tidak tercatat di Absen Masuk dan Absen Pulang'  " +
                "else (case when yy.state='Transfered' then 'Tercatat' " +
                "when yy.state = 'prepared' then 'Belum Tercatat' " +
                "else 'Error' end)  " +
                "end as status2 " +
                "from " +
                "( " +
                "select to_char(dates_this_month, 'YYYY-MM-DD')  as Tgl_absen,  " +
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
                ") a 	where dates_this_month between (current_date - interval '1 days' * $2) and now() " +
                ") ss left join  " +
                "( " +
                "with x as(select a.employee_id,to_char(a.clocking_date,'YYYY-MM-DD') as tgl_absen , " +
                "case when in_out='0' then 'Absen Masuk' else 'Absen Pulang' end as kategori,  " +
                "to_char(a.clocking_date,'hh24:mi')  as jam, a.state " +
                "from emp_clocking_temp_tbl a " +
                "where employee_id ='0002738' and  a.clocking_date between (current_date - interval '1 days' * $2) and current_date  " +
                "order by clocking_date desc) " +
                "select x.employee_id ,x.tgl_absen, x.kategori, min(jam) jam " +
                "from x  " +
                "group  by x.employee_id ,x.tgl_absen, x.kategori " +
                ") xx on xx.tgl_absen=ss.Tgl_absen " +
                "left join emp_clocking_temp_tbl yy on xx.employee_id=yy.employee_id  " +
                "and xx.tgl_absen=to_char(yy.clocking_date,'YYYY-MM-DD')  " +
                "and xx.jam = to_char(yy.clocking_date,'hh24:mi') " +
                "left join emp_clocking_tbl zz on xx.employee_id=zz.employee_id and xx.tgl_absen  = to_char(zz.clocking_date,'YYYY-MM-DD') " +
                "order by tgl_absen desc"
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