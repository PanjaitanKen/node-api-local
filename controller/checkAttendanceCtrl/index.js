const pool = require('../../db')

//Tabel : employeeworkofftbl, leaverequest_tbl
var controller = {
    checkAttendance: function(request, response) {
        try {
            const { employee_id } = request.body
            // var dateFormat = require('dateformat');
            // var day=dateFormat("isoTime");
            // var dayNow = "12:00:00"
            // console.log (day > dayNow);

            pool.db_MMFPROD.query("SELECT time_in FROM emp_clocking_detail_tbl where clocking_date =current_date and employee_id = $1", [employee_id], (error, results) => {
                if (error) {
                    throw error
                }
                if(results.rows != '' && results.rows != undefined){
                    if(results.rows[0].time_in != '' && results.rows[0].time_in !== null){
                        pool.db_MMFPROD.query("SELECT time_out FROM emp_clocking_detail_tbl where clocking_date =current_date and employee_id = $1", [employee_id], (error, results) => {
                            if (error) {
                            throw error
                            }
                            if(results.rows[0].time_out != '' && results.rows[0].time_out !== null ){
                                response.status(200).send({
                                    status: 200,
                                    message: 'Berhasil Clock In dan Clock Out',
                                    data: 2
                                });
                            }
                            else{
                                response.status(200).send({
                                    status: 200,
                                    message: 'Berhasil Clock In dan Belum Clock Out',
                                    data: 1
                                });
                            }
                            })
                            
                    }else{
                        response.status(200).send({
                            status: 200,
                            message: 'Belum Melakukan Clock In dan Clock Out',
                            data: 0
                        });
                    }
                }
                else{
                    response.status(200).send({
                        status: 200,
                        message: 'Belum melakukan clock in dan clock out',
                        data: 0
                    });
                }
            })
        } catch (err) {
            res.status(500).send(err);
        }
    }
};

module.exports = controller;