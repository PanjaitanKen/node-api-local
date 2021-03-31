const pool = require('../../db');

// Tabel : mark_location_tbl, emp_work_schedule_tbl, emp_work_location_tbl
const controller = {
  getLongitude_Branch(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_MMFPROD.query(
        "select count(*) from emp_work_schedule_tbl a left join emp_work_location_tbl b on a.employee_id =b.employee_id and current_date between b.valid_from and b.valid_to  where clocking_all ='Y' and current_date between a.valid_from and a.valid_to and a.employee_id= $1 ",
        [employee_id],
        (error, results) => {
          if (error) throw error;
          if (results.rows[0].count == 1) {
            pool.db_MMFPROD.query(
              'select location_name,location_no, latitude,altitude, longitude, accuracy, radius_tolerance from mark_location_tbl order by location_no asc',
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
          } else {
            pool.db_MMFPROD.query(
              "select case when work_location='JAKARTA' then 'PUSAT' when work_location='MAKASSAR' then 'MAKASSAR 2' else work_location end as work_location " +
                ' from emp_work_location_tbl where employee_id=$1 and  current_date between valid_from and valid_to ',
              [employee_id],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rows != '') {
                  const location_name = results.rows[0].work_location;
                  pool.db_MMFPROD.query(
                    'select location_name,location_no, latitude,altitude, longitude, accuracy, radius_tolerance from mark_location_tbl where location_name=$1 order by location_no asc',
                    [location_name],
                    (error, results) => {
                      if (error) throw error;

                      response.status(200).send({
                        status: 200,
                        message: 'Load Data berhasil',
                        validate_id: employee_id,
                        data: results.rows,
                      });
                    }
                  );
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
          }
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
