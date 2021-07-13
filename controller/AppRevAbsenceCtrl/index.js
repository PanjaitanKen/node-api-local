const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  AppRevAbsence(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, date_filter, rev_id } = request.body;

    // Helpers.logger(
    //   'SUCCESS',
    //   {
    //     employee_id,
    //     date_filter,
    //   },
    //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence'
    // );

    try {
      pool.db_MMFPROD.query(
        ` select company_id ,employee_id ,clocking_date ,result_revised ,presence ,normal_hour ,overtime_hour ,absence_hour ,
        late_hour,early_hour ,overtime_paid ,temp_day_type ,revised_company ,revised_by ,calc_day_type ,
        normal_hour_off, late_in_wage , early_out_wage ,early_break_hour ,late_break_hour ,state ,golid ,golversion 
        from emp_clocking_tbl ect 
        where employee_id =$1 and clocking_date = $2
        order by clocking_date desc`,
        [employee_id, date_filter],
        (error, results) => {
          if (error) {
            // Helpers.logger(
            //   'ERROR',
            //   {
            //     employee_id,
            //     date_filter
            //   },
            //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
            //   error
            // );

            throw error;
          }
          //  eslint-disable-next-line eqeqeq
          if (results.rows != 0) {
            const data_company_id = results.rows[0].company_id;
            const data_result_revised = results.rows[0].result_revised;
            const data_presence = results.rows[0].presence;
            const data_normal_hour = results.rows[0].normal_hour;
            const data_overtime_hour = results.rows[0].overtime_hour;
            const data_absence_hour = results.rows[0].absence_hour;
            const data_late_hour = results.rows[0].late_hour;
            const data_early_hour = results.rows[0].early_hour;
            const data_overtime_paid = results.rows[0].overtime_paid;
            const data_temp_day_type = results.rows[0].temp_day_type;
            const data_revised_company = results.rows[0].revised_company;
            const data_revised_by = results.rows[0].revised_by;
            const data_calc_day_type = results.rows[0].calc_day_type;
            const data_normal_hour_off = results.rows[0].normal_hour_off;
            const data_late_in_wage = results.rows[0].late_in_wage;
            const data_early_out_wage = results.rows[0].early_out_wage;
            const data_early_break_hour = results.rows[0].early_break_hour;
            const data_late_break_hour = results.rows[0].late_break_hour;
            const data_state = results.rows[0].state;
            const data_golversion = results.rows[0].golversion;
            const data_golid = results.rows[0].golid;

            // eslint-disable-next-line eqeqeq
            pool.db_HCM.query(
              `insert into temp_emp_clocking_tbl (company_id ,employee_id ,clocking_date ,result_revised ,presence ,normal_hour ,overtime_hour ,absence_hour ,
                late_hour,early_hour ,overtime_paid ,temp_day_type ,revised_company ,revised_by ,calc_day_type ,
                normal_hour_off, late_in_wage , early_out_wage ,early_break_hour ,late_break_hour ,state ,golid ,golversion, rev_absence_id)
                values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
              [
                data_company_id,
                employee_id,
                date_filter,
                data_result_revised,
                data_presence,
                data_normal_hour,
                data_overtime_hour,
                data_absence_hour,
                data_late_hour,
                data_early_hour,
                data_overtime_paid,
                data_temp_day_type,
                data_revised_company,
                data_revised_by,
                data_calc_day_type,
                data_normal_hour_off,
                data_late_in_wage,
                data_early_out_wage,
                data_early_break_hour,
                data_late_break_hour,
                data_state,
                data_golid,
                data_golversion,
                rev_id,
              ],
              (error, results) => {
                if (error) {
                  // Helpers.logger(
                  //   'ERROR',
                  //   {
                  //     employee_id,
                  //     date_filter,
                  //     rev_id,
                  //   },
                  //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                  //   error
                  // );

                  throw error;
                }

                // eslint-disable-next-line eqeqeq
                if (results.rowCount != 0) {
                  pool.db_MMFPROD.query(
                    `delete from emp_clocking_tbl where employee_id =$1 and clocking_date = $2`,
                    [employee_id, date_filter],
                    (error, results) => {
                      if (error) {
                        // Helpers.logger(
                        //   'ERROR',
                        //   {
                        //     employee_id,
                        //     date_filter,
                        //     rev_id,
                        //     status,
                        //   },
                        //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                        //   error
                        // );

                        throw error;
                      }

                      // eslint-disable-next-line eqeqeq
                      console.log(
                        '>>>>>>>>>>>>>>>>>>>>>>>masuk delete 1<<<<<<<<<<<<<<<<'
                      );

                      if (results.rowCount != 0) {
                        pool.db_MMFPROD.query(
                          `select company_id ,employee_id ,clocking_date ,time_in ,time_out ,off_site ,is_break ,note ,in_terminal,
                          out_terminal ,in_reg_type ,out_reg_type, absence_wage ,in_location ,out_location ,golid ,golversion 
                          from emp_clocking_detail_tbl ecdt 
                          where employee_id =$1 and clocking_date = $2
                          order by clocking_date desc`,
                          [employee_id, date_filter],
                          (error, results) => {
                            if (error) {
                              // Helpers.logger(
                              //   'ERROR',
                              //   {
                              //     employee_id,
                              //     date_filter,
                              //     rev_id,
                              //     status,
                              //   },
                              //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                              //   error
                              // );

                              throw error;
                            }

                            // eslint-disable-next-line eqeqeq
                            if (results.rows != 0) {
                              const data1_company_id =
                                results.rows[0].company_id;
                              const data1_time_in = results.rows[0].time_in;
                              const data1_time_out = results.rows[0].time_out;
                              const data1_off_site = results.rows[0].off_site;
                              const data1_is_break = results.rows[0].is_break;
                              const data1_note = results.rows[0].note;
                              const data1_in_terminal =
                                results.rows[0].in_terminal;
                              const data1_out_terminal =
                                results.rows[0].out_terminal;
                              const data1_in_reg_type =
                                results.rows[0].in_reg_type;
                              const data1_out_reg_type =
                                results.rows[0].out_reg_type;
                              const data1_absence_wage =
                                results.rows[0].absence_wage;
                              const data1_in_location =
                                results.rows[0].in_location;
                              const data1_out_location =
                                results.rows[0].out_location;
                              const data1_golid = results.rows[0].golid;
                              const data1_golversion =
                                results.rows[0].golversion;

                              pool.db_HCM.query(
                                `insert into temp_emp_clocking_detail_tbl (company_id ,employee_id ,clocking_date ,time_in ,time_out ,off_site ,is_break ,note ,in_terminal,
                                  out_terminal ,in_reg_type ,out_reg_type, absence_wage ,in_location ,out_location ,golid ,golversion, rev_absence_id )
                                  values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
                                [
                                  data1_company_id,
                                  employee_id,
                                  date_filter,
                                  data1_time_in,
                                  data1_time_out,
                                  data1_off_site,
                                  data1_is_break,
                                  data1_note,
                                  data1_in_terminal,
                                  data1_out_terminal,
                                  data1_in_reg_type,
                                  data1_out_reg_type,
                                  data1_absence_wage,
                                  data1_in_location,
                                  data1_out_location,
                                  data1_golid,
                                  data1_golversion,
                                  rev_id,
                                ],
                                (error, results) => {
                                  if (error) {
                                    // Helpers.logger(
                                    //   'ERROR',
                                    //   {
                                    //     employee_id,
                                    //     date_filter,
                                    //     rev_id,
                                    //     status,
                                    //   },
                                    //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                    //   error
                                    // );

                                    throw error;
                                  }

                                  // eslint-disable-next-line eqeqeq
                                  console.log(
                                    '>>>>>>>>>>>>>>>>>>>>>>>masuk insert 2<<<<<<<<<<<<<<<<'
                                  );
                                  if (results.rowCount != 0) {
                                    pool.db_MMFPROD.query(
                                      `delete from emp_clocking_detail_tbl where employee_id =$1 and clocking_date = $2 `,
                                      [employee_id, date_filter],
                                      (error, results) => {
                                        if (error) {
                                          // Helpers.logger(
                                          //   'ERROR',
                                          //   {
                                          //     employee_id,
                                          //     date_filter,
                                          //     rev_id,
                                          //     status,
                                          //   },
                                          //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                          //   error
                                          // );

                                          throw error;
                                        }

                                        // eslint-disable-next-line eqeqeq
                                        console.log(
                                          '>>>>>>>>>>>>>>>>>>>>>>>masuk delete 2<<<<<<<<<<<<<<<<'
                                        );
                                        if (results.rowCount != 0) {
                                          pool.db_MMFPROD.query(
                                            `select company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note, transfer_message ,
                                            state,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,
                                            location_method ,golid ,golversion 
                                            from emp_clocking_temp_tbl ectt 
                                            where employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD') = to_Char($2::date,'YYYY-MM-DD')`,
                                            [employee_id, date_filter],
                                            (error, results) => {
                                              if (error) {
                                                // Helpers.logger(
                                                //   'ERROR',
                                                //   {
                                                //     employee_id,
                                                //     date_filter,
                                                //     rev_id,
                                                //     status,
                                                //   },
                                                //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                //   error
                                                // );

                                                throw error;
                                              }

                                              // eslint-disable-next-line eqeqeq
                                              if (results.rows != 0) {
                                                const data2_company_id =
                                                  results.rows[0].company_id;
                                                const data2_in_out =
                                                  results.rows[0].in_out;
                                                const data2_terminal_id =
                                                  results.rows[0].terminal_id;
                                                const data2_off_site =
                                                  results.rows[0].off_site;
                                                const data2_transfer_message =
                                                  results.rows[0]
                                                    .transfer_message;
                                                const data2_note =
                                                  results.rows[0].note;
                                                const data2_state =
                                                  results.rows[0].state;
                                                const data2_latitude =
                                                  results.rows[0].latitude;
                                                const data2_altitude =
                                                  results.rows[0].altitude;
                                                const data2_longitude =
                                                  results.rows[0].longitude;
                                                const data2_accuracy =
                                                  results.rows[0].accuracy;
                                                const data2_location_no =
                                                  results.rows[0].location_no;
                                                const data2_url_photo =
                                                  results.rows[0].url_photo;
                                                const data2_url_remove =
                                                  results.rows[0].url_remove;
                                                const data2_golversion =
                                                  results.rows[0].golversion;
                                                const data2_file_name =
                                                  results.rows[0].file_name;
                                                const data2_golid =
                                                  results.rows[0].golid;
                                                const data2_location_method =
                                                  results.rows[0]
                                                    .location_method;

                                                pool.db_HCM.query(
                                                  `insert into temp_emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note, transfer_message ,
                                                    state,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,
                                                    location_method ,golid ,golversion,  rev_absence_id)
                                                    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20, $21)`,
                                                  [
                                                    data2_company_id,
                                                    employee_id,
                                                    date_filter,
                                                    data2_in_out,
                                                    data2_terminal_id,
                                                    data2_off_site,
                                                    data2_note,
                                                    data2_transfer_message,
                                                    data2_state,
                                                    data2_latitude,
                                                    data2_altitude,
                                                    data2_longitude,
                                                    data2_accuracy,
                                                    data2_location_no,
                                                    data2_url_photo,
                                                    data2_url_remove,
                                                    data2_file_name,
                                                    data2_location_method,
                                                    data2_golid,
                                                    data2_golversion,
                                                    rev_id,
                                                  ],
                                                  (error, results) => {
                                                    if (error) {
                                                      // Helpers.logger(
                                                      //   'ERROR',
                                                      //   {
                                                      //     employee_id,
                                                      //     date_filter,
                                                      //     rev_id,
                                                      //     status,
                                                      //   },
                                                      //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                      //   error
                                                      // );

                                                      throw error;
                                                    }

                                                    // eslint-disable-next-line eqeqeq
                                                    console.log(
                                                      '>>>>>>>>>>>>>>>>>>>>>>>masuk insert 2<<<<<<<<<<<<<<<<'
                                                    );
                                                    if (results.rowCount != 0) {
                                                      pool.db_MMFPROD.query(
                                                        `delete from emp_clocking_temp_tbl where employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD') = to_char($2::date,'YYYY-MM-DD') `,
                                                        [
                                                          employee_id,
                                                          date_filter,
                                                        ],
                                                        (error, results) => {
                                                          if (error) {
                                                            // Helpers.logger(
                                                            //   'ERROR',
                                                            //   {
                                                            //     employee_id,
                                                            //     date_filter,
                                                            //     rev_id,
                                                            //     status,
                                                            //   },
                                                            //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                            //   error
                                                            // );

                                                            throw error;
                                                          }

                                                          // eslint-disable-next-line eqeqeq
                                                          console.log(
                                                            '>>>>>>>>>>>>>>>>>>>>>>>masuk delete 2<<<<<<<<<<<<<<<<'
                                                          );
                                                          if (
                                                            results.rowCount !=
                                                            0
                                                          ) {
                                                            response
                                                              .status(200)
                                                              .send({
                                                                status: 200,
                                                                message:
                                                                  'del Data Success',
                                                                validate_id: employee_id,
                                                                data: '',
                                                              });
                                                          } else {
                                                            response
                                                              .status(200)
                                                              .send({
                                                                status: 200,
                                                                message:
                                                                  'Data Tidak Ditemukan 1',
                                                                validate_id: employee_id,
                                                                data: '',
                                                              });
                                                          }
                                                        }
                                                      );
                                                    } else {
                                                      response
                                                        .status(200)
                                                        .send({
                                                          status: 200,
                                                          message:
                                                            'Data Tidak Ditemukan 2',
                                                          validate_id: employee_id,
                                                          data: '',
                                                        });
                                                    }
                                                  }
                                                );
                                              } else {
                                                response.status(200).send({
                                                  status: 200,
                                                  message:
                                                    'Data Tidak Ditemukan 3',
                                                  validate_id: employee_id,
                                                  data: '',
                                                });
                                              }
                                            }
                                          );
                                        } else {
                                          response.status(200).send({
                                            status: 200,
                                            message: 'Data Tidak Ditemukan 4',
                                            validate_id: employee_id,
                                            data: '',
                                          });
                                        }
                                      }
                                    );
                                  } else {
                                    response.status(200).send({
                                      status: 200,
                                      message: 'Data Tidak Ditemukan 5',
                                      validate_id: employee_id,
                                      data: '',
                                    });
                                  }
                                }
                              );
                            } else {
                              response.status(200).send({
                                status: 200,
                                message: 'Data Tidak Ditemukan 6',
                                validate_id: employee_id,
                                data: '',
                              });
                            }
                          }
                        );
                      } else {
                        response.status(200).send({
                          status: 200,
                          message: 'Data Tidak Ditemukan 7',
                          validate_id: employee_id,
                          data: '',
                        });
                      }
                    }
                  );
                } else {
                  response.status(200).send({
                    status: 200,
                    message: 'Insert data gagal',
                    validate_id: employee_id,
                    data: '',
                  });
                }
              }
            );
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan 8',
              validate_id: employee_id,
              data: '',
            });
          }
          // eslint-disable-next-line eqeqeq
          // pool.db_MMFPROD.query(
          //   `update approval_rev_absence_hcm  set status =$4, status_date = current_date
          //   where
          //   employee_id= $1 and to_char(status_date,'YYYY-MM-DD') = to_char($2::date,'YYYY-MM-DD')  and rev_absence_id = $3`,
          //   [employee_id, date_filter, rev_id, status],
          //   (error, results) => {
          //     if (error) {
          //       Helpers.logger(
          //         'ERROR',
          //         {
          //           employee_id,
          //           date_filter,
          //           rev_id,
          //           status,
          //         },
          //         'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
          //         error
          //       );

          //       throw error;
          //     }

          //     // eslint-disable-next-line eqeqeq
          //     if (results.rowCount != 0) {
          //       response.status(200).send({
          //         status: 200,
          //         message: 'Update Data Success',
          //         validate_id: employee_id,
          //         data: '',
          //       });
          //     } else {
          //       response.status(200).send({
          //         status: 200,
          //         message: 'Data Tidak Ditemukan',
          //         validate_id: employee_id,
          //         data: '',
          //       });
          //     }
          //   }
          // );
        }
      );
    } catch (err) {
      // Helpers.logger(
      //   'ERROR',
      //   {
      //     employee_id,
      //     date_filter,
      //     rev_id,
      //     status,
      //   },
      //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
      //   err
      // );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
