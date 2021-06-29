const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : person_tbl, employee_tbl
const controller = {
  getBirthDate(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id } = request.body;

    Helpers.logger('SUCCESS', { employee_id }, 'dateCtrl.getBirthDate');

    try {
      pool.db_MMFPROD.query(
        "SELECT b.employee_id,to_char(birth_date,'MM-DD-YYYY') as birth_Date FROM person_tbl a left join employee_tbl b on a.person_id =b.person_id WHERE b.employee_id = $1 and to_char(birth_date,'DDMM')=to_char(current_date ,'DDMM')",
        [employee_id],
        (error, results) => {
          if (error) {
            Helpers.logger(
              'ERROR',
              { employee_id },
              'dateCtrl.getBirthDate',
              error
            );

            throw error;
          }

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data Berhasil',
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
      Helpers.logger('ERROR', { employee_id }, 'dateCtrl.getBirthDate', err);
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
