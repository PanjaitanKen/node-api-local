const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  getParamHCM(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, date_filter, rev_id, status } = request.body;

    Helpers.logger(
      'SUCCESS',
      {
        employee_id,
      },
      'getParamHCMCtrl.getParamHCM'
    );

    try {
      pool.db_HCM.query(
        `select 
        (select coalesce(setting_value,' ') as value_status_vaksin  from param_hcm where setting_name = 'MENU STATUS VAKSIN') as value_status_vaksin,
        (select count(*) input_status_vaksin from mas_data_vaksin where employee_id= $1) as input_status_vaksin `,
        [employee_id],
        (error, results) => {
          if (error) {
            Helpers.logger(
              'ERROR',
              {
                employee_id,
              },
              'getParamHCMCtrl.getParamHCM',
              error
            );

            throw error;
          }

          // eslint-disable-next-line eqeqeq
          if (results.rows != 0) {
            response.status(200).send({
              status: 200,
              message: 'Load Data Success',
              validate_id: employee_id,
              data: results.rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Not Found',
              validate_id: employee_id,
              data: '',
            });
          }
        }
      );
    } catch (err) {
      Helpers.logger(
        'ERROR',
        {
          employee_id,
        },
        'getParamHCMCtrl.getParamHCM',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
