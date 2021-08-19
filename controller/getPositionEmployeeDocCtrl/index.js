const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : travel_request_tbl, travel_request_destination_tbl
const controller = {
  async getPositionEmployee_Doc(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id } = request.body;

    Helpers.logger(
      'SUCCESS',
      { employee_id },
      'getPositionEmployeeDocCtrl.getPositionEmployee_Doc'
    );

    try {
      const query = `select a.employee_id ,a.position_id, d.grade_id ,c.description 
        from employee_position_tbl a
        left join emp_grade_interval_tbl b on a.employee_id = b.employee_id and current_date between b.valid_from and b.valid_to
        left join employee_grade_tbl c on b.grade_id =c.grade_id 
        left join position_grade_tbl d on c.description =d.description 
        where a.employee_id =$1 `;

      await pool.db_MMFPROD
        .query(query, [employee_id])
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: employee_id,
              data: '',
            });
          }
        })
        .catch((error) => {
          Helpers.logger(
            'ERROR',
            { employee_id },
            'getPositionEmployeeDocCtrl.getPositionEmployee_Doc',
            error
          );
          throw error;
        });
    } catch (err) {
      Helpers.logger(
        'ERROR',
        { employee_id },
        'getPositionEmployeeDocCtrl.getPositionEmployee_Doc',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
