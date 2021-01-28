const pool = require('../../db')

//Tabel : emp_clocking_temp_tbl
var controller = {
    getHist_Detail_Absence: function (request, response) {
        try {
            const { employee_id , clocking_date } = request.body
            // console.log (request.body)

            pool.db_MMFPROD.query(
                "select a.employee_id,to_char(a.clocking_date,'YYYY-MM-DD') as tgl_absen , " +
                "case when trim(to_char(a.clocking_date,'Day'))='Sunday' then 'Minggu' " +
                "when trim(to_char(a.clocking_date,'Day'))='Monday' then 'Senin'" +
                "when trim(to_char(a.clocking_date,'Day'))='Tuesday' then 'Selasa'" +
                "when trim(to_char(a.clocking_date,'Day'))='Wednesday' then 'Rabu'" +
                "when trim(to_char(a.clocking_date,'Day'))='Thursday' then 'Kamis'" +
                "when trim(to_char(a.clocking_date,'Day'))='Friday' then 'Jumat'" +
                "when trim(to_char(a.clocking_date,'Day'))='Saturday' then 'Sabtu' else ' ' end ||', '||to_char(a.clocking_date,'DD')||' '||" +
                "case when to_char(a.clocking_date,'MM')='01' then 'Jan'" +
                "when to_char(a.clocking_date,'MM')='02' then 'Feb'" +
                "when to_char(a.clocking_date,'MM')='03' then 'Mar'" +
                "when to_char(a.clocking_date,'MM')='04' then 'Apr'" +
                "when to_char(a.clocking_date,'MM')='05' then 'Mei'" +
                "when to_char(a.clocking_date,'MM')='06' then 'Jun'" +
                "when to_char(a.clocking_date,'MM')='07' then 'Jul'" +
                "when to_char(a.clocking_date,'MM')='08' then 'Ags'" +
                "when to_char(a.clocking_date,'MM')='09' then 'Sep'" +
                "when to_char(a.clocking_date,'MM')='10' then 'Okt'" +
                "when to_char(a.clocking_date,'MM')='11' then 'Nov'" +
                "when to_char(a.clocking_date,'MM')='11' then 'Des' end ||' '||to_char(a.clocking_date,'YYYY') as tgl_absen2," +
                "case when in_out='0' then 'Absen Masuk' else 'Absen Pulang' end as kategori, " +
                "to_char(a.clocking_date,'hh24:mi')  as jam, a.transfer_message ,a.state " +
                "from emp_clocking_temp_tbl a " +
                "where employee_id = $1 and to_char(a.clocking_date,'YYYY-MM-DD') = $2 " +
                "order by clocking_date desc"
                , [employee_id, clocking_date], (error, results) => {
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