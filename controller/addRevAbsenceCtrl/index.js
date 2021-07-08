const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  addRevAbsence(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      employee_id,
      clocking_date,
      employee_name,
      id_category,
      schedule_type,
      days_to,
      day_type,
      default_clockin,
      default_clockout,
      register_time_in,
      register_time_out,
      renew_time_in,
      renew_time_out,
      reason,
      spv_employee_id,
      spv_employee_name,
      spv_employee_position,
    } = request.body;

    Helpers.logger(
      'SUCCESS',
      {
        employee_id,
        clocking_date,
        employee_name,
        id_category,
        schedule_type,
        days_to,
        day_type,
        default_clockin,
        default_clockout,
        register_time_in,
        register_time_out,
        renew_time_in,
        renew_time_out,
        reason,
        spv_employee_id,
        spv_employee_name,
        spv_employee_position,
      },
      'addRevAbsenceCtrl.addRevAbsence'
    );

    try {
      pool.db_MMFPROD.query(
        ` select count(*) ada_data from rev_absence_hcm
        where employee_id = $1 and clocking_date =$2::date 
        and state in ('Submitted','Approval')`,
        [employee_id, clocking_date],
        (error, results) => {
          if (error) {
            Helpers.logger(
              'ERROR',
              {
                employee_id,
                clocking_date,
              },
              'addRevAbsenceCtrl.addRevAbsence',
              error
            );

            throw error;
          }

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            if (results.rows[0].ada_data != '1') {
              pool.db_MMFPROD.query(
                ` insert into rev_absence_hcm (employee_id, display_name,category_rev_id, clocking_date, 
                  request_date,state,schedule_type,days_to,day_type,def_time_in,def_time_out, reg_time_in, reg_time_out, 
                  rev_time_in,rev_time_out,reason, note) 
                  values ($1,$2,$3,$4,current_date,'Submitted',$5,$6,$7,
                  $8,$9,$10,$11,$12,$13,$14,' ')`,
                [
                  employee_id,
                  employee_name,
                  id_category,
                  clocking_date,
                  schedule_type,
                  days_to,
                  day_type,
                  default_clockin,
                  default_clockout,
                  register_time_in,
                  register_time_out,
                  renew_time_in,
                  renew_time_out,
                  reason,
                ],
                (error, results) => {
                  if (error) {
                    Helpers.logger(
                      'ERROR',
                      {
                        employee_id,
                        clocking_date,
                        employee_name,
                        id_category,
                        schedule_type,
                        days_to,
                        day_type,
                        default_clockin,
                        default_clockout,
                        register_time_in,
                        register_time_out,
                        renew_time_in,
                        renew_time_out,
                        reason,
                      },
                      'addRevAbsenceCtrl.addRevAbsence',
                      error
                    );

                    throw error;
                  }

                  // eslint-disable-next-line eqeqeq
                  pool.db_MMFPROD.query(
                    `select rev_absence_id from rev_absence_hcm where employee_id = $1 and 
                    clocking_date =$2::date and state in ('Submitted','Approval') and category_rev_id = $3`,
                    [employee_id, clocking_date, id_category],
                    (error, results) => {
                      if (error) {
                        Helpers.logger(
                          'ERROR',
                          {
                            employee_id,
                            clocking_date,
                            id_category,
                          },
                          'addRevAbsenceCtrl.addRevAbsence',
                          error
                        );

                        throw error;
                      }

                      // eslint-disable-next-line eqeqeq
                      if (results.rows != '') {
                        const rev_absenceid = results.rows[0].rev_absence_id;
                        pool.db_MMFPROD.query(
                          `insert into approval_rev_absence_hcm (rev_absence_id , employee_id ,sequence_no , status, 
                            status_date ,approved_by ,approved_name ,approved_pos_id ,note) 
                            values ($1,$2,1,'Submitted',current_date, $3, $4, $5, ' ')`,
                          [
                            rev_absenceid,
                            employee_id,
                            spv_employee_id,
                            spv_employee_name,
                            spv_employee_position,
                          ],
                          (error, results) => {
                            if (error) {
                              Helpers.logger(
                                'ERROR',
                                {
                                  rev_absenceid,
                                  employee_id,
                                  spv_employee_id,
                                  spv_employee_name,
                                  spv_employee_position,
                                },
                                'addRevAbsenceCtrl.addRevAbsence',
                                error
                              );

                              throw error;
                            }

                            // eslint-disable-next-line eqeqeq
                            response.status(200).send({
                              status: 200,
                              message: 'SUCCESS INSERT DATA',
                              validate_id: employee_id,
                              data: results.rows,
                            });
                          }
                        );
                      } else {
                        response.status(200).send({
                          status: 200,
                          message: 'Data Not Found',
                          validate_id: employee_id,
                          data: results.rows,
                        });
                      }
                    }
                  );
                }
              );
            } else {
              response.status(200).send({
                status: 200,
                message: 'Data Already Exists',
                validate_id: employee_id,
                data: '',
              });
            }
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
          clocking_date,
          employee_name,
          id_category,
          schedule_type,
          days_to,
          day_type,
          default_clockin,
          default_clockout,
          register_time_in,
          register_time_out,
          renew_time_in,
          renew_time_out,
          reason,
          spv_employee_id,
          spv_employee_name,
          spv_employee_position,
        },
        'addRevAbsenceCtrl.addRevAbsence',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
