const { validationResult } = require('express-validator');
const axios = require('axios');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  async addRevAbsence(request, response) {
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
      hp_approver,
      email_approver,
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
        hp_approver,
        email_approver,
      },
      'addRevAbsenceCtrl.addRevAbsence'
    );

    const rev_time_in = clocking_date + ' ' + renew_time_in + ':' + '00';
    const rev_time_out = clocking_date + ' ' + renew_time_out + ':' + '00';

    try {
      await pool.db_MMFPROD
        .query(
          ` select count(*) ada_data from rev_absence_hcm
        where employee_id = $1 and clocking_date =$2::date 
        and state in ('Submitted','Approval')`,
          [employee_id, clocking_date]
        )
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            if (rows[0].ada_data != '1') {
              await pool.db_MMFPROD
                .query(
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
                    rev_time_in,
                    rev_time_out,
                    reason,
                  ]
                )
                .then(async () => {
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
                            // insert notification perubahan absen -- start
                            const data = {
                              employee_id,
                              employee_name,
                              submission_id: '1',
                            };

                            const options = {
                              headers: {
                                'Content-Type': 'application/json',
                                API_KEY: process.env.API_KEY,
                              },
                            };

                            axios
                              .post(
                                `${process.env.URL}/hcm/api/pNRevAbsen`,
                                data,
                                options
                              )
                              .then((res) => {
                                console.log('RESPONSE ==== : ', res.data);
                              })
                              .catch((err) => {
                                console.log('ERROR: ====', err);
                                throw err;
                              });
                            // insert notification perubahan absen -- end
                            const subject_email = 'Pengajuan Perbaikan Absen';
                            const email_to = email_approver;

                            pool.db_HCM.query(
                              'select * from param_hcm ',
                              (error, results) => {
                                if (error) throw error;

                                if (results.rowCount > 0) {
                                  // map hostmail
                                  const hostMailValue = _.filter(
                                    results.rows,
                                    (o) => o.setting_name == 'Host Feedback'
                                  );

                                  // map userMailValue
                                  const userMailValue = _.filter(
                                    results.rows,
                                    (o) => o.setting_name == 'Email Feedback'
                                  );

                                  const passwordMailValue = _.filter(
                                    results.rows,
                                    (o) => o.setting_name == 'Password Feedback'
                                  );

                                  const hostMail =
                                    hostMailValue[0].setting_value;

                                  const userMail =
                                    userMailValue[0].setting_value;

                                  const passwordMail =
                                    passwordMailValue[0].setting_value;

                                  const transporter = nodemailer.createTransport(
                                    {
                                      host: hostMail,
                                      port: 587,
                                      secure: false, // use SSL
                                      auth: {
                                        user: userMail,
                                        pass: passwordMail,
                                      },
                                      tls: {
                                        rejectUnauthorized: false,
                                      },
                                    }
                                  );

                                  const mailOptions = {
                                    from: userMail,
                                    to: email_to,
                                    subject: subject_email,
                                    text:
                                      `Dear ${spv_employee_name} \n` +
                                      '\n' +
                                      `No.Karyawan : ${employee_id} \n` +
                                      `Tanggal Absen : ${clocking_date} \n` +
                                      'Jenis Perbaikan : Perbaikan Absen Masuk dan Pulang \n' +
                                      `Jam Masuk Perbaikan : ${rev_time_in}  \n` +
                                      `Jam Pulang Perbaikan : ${rev_time_out}  \n` +
                                      `Alasan : ${reason}  \n` +
                                      '\n' +
                                      'Demikian pengajuan yang disampaikan \n' +
                                      '\n' +
                                      'Salam Hormat \n' +
                                      `${employee_name}`,
                                  };

                                  transporter.sendMail(mailOptions, (error) => {
                                    if (error) {
                                      console.error(
                                        'ERROR (email tidak ada): ====',
                                        error
                                      );

                                      response.status(500).send({
                                        status: 500,
                                        message:
                                          'Kami mengetahui bahwa email ini di sistem tidak ada!',
                                        validate_id: employee_id,
                                        data: '',
                                      });
                                    }

                                    // insert wa message -- start
                                    const data = {
                                      to: hp_approver,
                                      header: 'Pengajuan Perbaikan Absen',
                                      text:
                                        `Dear ${spv_employee_name} \n` +
                                        '\n' +
                                        `No.Karyawan : ${employee_id} \n` +
                                        `Tanggal Absen : ${clocking_date} \n` +
                                        'Jenis Perbaikan : Perbaikan Absen Masuk dan Pulang \n' +
                                        `Jam Masuk Perbaikan : ${rev_time_in}  \n` +
                                        `Jam Pulang Perbaikan : ${rev_time_out}  \n` +
                                        `Alasan : ${reason}  \n` +
                                        '\n',
                                      text2:
                                        'Demikian pengajuan yang disampaikan \n' +
                                        '\n' +
                                        'Salam Hormat \n' +
                                        `${employee_name}`,
                                    };

                                    const options = {
                                      headers: {
                                        'Content-Type': 'application/json',
                                        API_KEY: process.env.API_KEY,
                                      },
                                    };

                                    axios
                                      .post(
                                        process.env.WA_SERVICE,
                                        data,
                                        options
                                      )
                                      .then((res) => {
                                        console.log(
                                          'RESPONSE ==== : ',
                                          res.data
                                        );
                                      })
                                      .catch((err) => {
                                        console.error(
                                          'ERROR (nomor telepon tidak ada): ====',
                                          err
                                        );

                                        response.status(500).send({
                                          status: 500,
                                          message:
                                            'Kami mengetahui bahwa nomor telepon ini di sistem tidak ada!',
                                          validate_id: employee_id,
                                          data: '',
                                        });
                                      });
                                    // insert wa message -- end

                                    response.status(200).send({
                                      status: 200,
                                      message:
                                        'Berhasil memperbaharui data serta mengirim email dan whatsapp',
                                      data: '',
                                    });
                                  });
                                } else {
                                  response.status(200).send({
                                    status: 200,
                                    message: 'Data Tidak Ditemukan',
                                    data: '',
                                  });
                                }
                              }
                            );
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
                });
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
        })
        .catch((error) => {
          throw error;
        });
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
          rev_time_in,
          rev_time_out,
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
