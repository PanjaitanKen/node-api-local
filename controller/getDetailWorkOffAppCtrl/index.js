const pool = require('../../db')

//Tabel : leave_request_tbl, employeetbl, persontbl
var controller = {
    getDetail_WorkOff_App: function(request, response) {
        try {
            const { golid } = request.body
            console.log (request.body)

            pool.db_MMFPROD.query("select a.employee_id, initcap(a.leave_name)  as jenis_cuti, initcap(d.display_name) as nama,leave_date_from as tgl_cuti_dr, leave_date_to as tgl_cuti_sd, reason as alasan,a.request_date as tgl_pengajuan,a.golid from leave_request_tbl a left join employee_tbl c on a.employee_id =c.employee_id left join person_tbl d on c.person_id =d.person_id where state='Submitted' and a.golid =$1 ", [golid], (error, results) => {
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