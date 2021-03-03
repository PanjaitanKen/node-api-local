const pool = require('../../db');

// Tabel : travel_request_tbl, travel_request_destination_tbl
const controller = {
  getPositionEmployee_Doc(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_MMFPROD.query(
        `select a.employee_id ,a.position_id, d.grade_id ,c.description 
        from employee_position_tbl a
        left join emp_grade_interval_tbl b on a.employee_id = b.employee_id and current_date between b.valid_from and b.valid_to
        left join employee_grade_tbl c on b.grade_id =c.grade_id 
        left join position_grade_tbl d on c.description =d.description 
        where a.employee_id =$1 `,
        [employee_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: results.rows[0],
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
