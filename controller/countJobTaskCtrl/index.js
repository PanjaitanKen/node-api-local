const pool = require('../../db')

//Tabel : employeeworkofftbl, leaverequest_tbl
var controller = {
    getCountJobTask: function (request, response) {
        try {
            const { employee_id } = request.body
            // console.log (request.body)

            pool.db_MMFPROD.query(
                "select sum(jumlahJobTask) jumlahJobTask ,"+
                " (select count(*) as atasan "+
                    " from  "+
                    " employee_supervisor_tbl  "+
                    " where supervisor_id = $1 and valid_to=date'9999-01-01') atasan "+
                
                " from (select count(*) jumlahJobTask from employee_work_off_tbl where state='Submitted' "+
                " and employee_id in (select employee_id from employee_supervisor_tbl "+
                " where supervisor_id =$1 and valid_to=date'9999-01-01') "+
                " union all select count(*) jumlahJobTask "+
                " from leave_request_tbl where state='Submitted'and employee_id in "+
                " (select employee_id from employee_supervisor_tbl where supervisor_id =$1 and "+
                "valid_to=date'9999-01-01')) a", [employee_id], (error, results) => {

                if (error) {
                    throw error
                }
                if (results.rows != '') {
                    response.status(200).send({
                        status: 200,
                        message: 'Load Data berhasil',
                        data: results.rows[0]
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