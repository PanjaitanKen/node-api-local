const pool = require('../../db')

//Tabel : mark_location_tbl, emp_work_schedule_tbl, emp_work_location_tbl
var controller = {
  getLongitude_Branch: function(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_MMFPROD.query("select count(*) from emp_work_schedule_tbl a left join emp_work_location_tbl b on a.employee_id =b.employee_id where clocking_all ='Y' and current_date between a.valid_from and a.valid_to and a.employee_id= $1 ", [employee_id], (error, results) => {
        if (error) {
            throw error
        }
        // console.log(results.rows[0].count)

        if(results.rows[0].count == 1){
          pool.db_MMFPROD.query("select location_name,location_no, latitude,altitude, longitude, accuracy, radius_tolerance from mark_location_tbl order by location_no asc", (error, results) => {
            if (error) {
              throw error
            }
            if(results.rows != ''){
              response.status(200).send({
                status: 200,
                message: 'Load Data berhasil',
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
        }
        else{
          pool.db_MMFPROD.query("select work_location from emp_work_location_tbl where employee_id=$1", [employee_id], (error, results) => {
            if (error) {
              throw error
            }
            if(results.rows != ''){
              let location_name  = results.rows[0].work_location ;
              pool.db_MMFPROD.query("select location_name,location_no, latitude,altitude, longitude, accuracy, radius_tolerance from mark_location_tbl where location_name=$1 order by location_no asc", [location_name], (error, results) => {
                if (error) {
                  throw error
                }
                  response.status(200).send({
                    status: 200,
                    message: 'Load Data berhasil',
                    data: results.rows
                  });
                })
            }else{
              response.status(200).send({
                status: 200,
                message: 'Data Tidak Ditemukan',
                data: results.rows
              });
            }
          })
        }
      })
    } catch (err) {
      res.status(500).send(err);
    }
  }
};

module.exports = controller;