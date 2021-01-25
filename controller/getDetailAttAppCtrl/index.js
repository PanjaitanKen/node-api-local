const pool = require('../../db')

//Tabel : employeeworkofftbl, wagecodetbl, employeetbl, person_tbl
var controller = {
    getDetail_Att_App: function(request, response) {
        try {
            const { golid } = request.body
            console.log (request.body)

            pool.db_MMFPROD.query("select a.employee_id, b.wage_name  as jenis_ijin, d.display_name as nama,work_off_from as tgl_ijin_dari, work_off_to as tgl_ijin_sd, reason as alasan,a.clocking_date as tgl_pengajuan,a.golid from employee_work_off_tbl a left join wage_code_tbl b on a.absence_wage =b.wage_code left join employee_tbl c on a.employee_id =c.employee_id left join person_tbl d on c.person_id =d.person_id where state='Submitted' and a.golid =$1 ", [golid], (error, results) => {
                if (error) {
                    throw error
                }
                if(results.rows != ''){
                    response.status(200).send({
                        status: 200,
                        message: 'Mendapatkan Semua Data',
                        data: results.rows
                    });
                }else{
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