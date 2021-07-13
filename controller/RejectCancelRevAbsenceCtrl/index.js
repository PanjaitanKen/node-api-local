const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  RejectCancelRevAbsence(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, date_filter, rev_id, status } = request.body;

    Helpers.logger(
      'SUCCESS',
      {
        employee_id,
        date_filter,
        rev_id,
        status,
      },
      'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence'
    );

    try {
      pool.db_MMFPROD.query(
        ` update rev_absence_hcm set state =$4 where 
        employee_id= $1 and to_char(clocking_date,'YYYY-MM-DD') = to_char($2::date,'YYYY-MM-DD')  and rev_absence_id = $3`,
        [employee_id, date_filter, rev_id, status],
        (error, results) => {
          if (error) {
            Helpers.logger(
              'ERROR',
              {
                employee_id,
                date_filter,
                rev_id,
                status,
              },
              'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
              error
            );

            throw error;
          }

          // eslint-disable-next-line eqeqeq
          pool.db_MMFPROD.query(
            `update approval_rev_absence_hcm  set status =$3, status_date = current_date  where
            employee_id= $1  and rev_absence_id = $2`,
            [employee_id,  rev_id, status],
            (error, results) => {
              if (error) {
                Helpers.logger(
                  'ERROR',
                  {
                    employee_id,
                    date_filter,
                    rev_id,
                    status,
                  },
                  'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                  error
                );

                throw error;
              }

              // eslint-disable-next-line eqeqeq
              if (results.rowCount != 0) {
                response.status(200).send({
                  status: 200,
                  message: 'Update Data Success',
                  validate_id: employee_id,
                  data: '',
                });
              } else {
                response.status(200).send({
                  status: 200,
                  message: 'Data Tidak Ditemukan',
                  validate_id: employee_id,
                  data: '',
                });
              }
            }
          );
        }
      );
    } catch (err) {
      Helpers.logger(
        'ERROR',
        {
          employee_id,
          date_filter,
          rev_id,
          status,
        },
        'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
