/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable implicit-arrow-linebreak */
const nodemailer = require('nodemailer');
const _ = require('lodash');
const { validationResult } = require('express-validator');
const axios = require('axios');
const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  checkScanQr(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      body: { userid_ck },
    } = request;

    try {
      // A
      pool.db_HCM.query(
        `select case when tgl_scan_qr is not null then 1 else 0 end as sudah_scan
        from trx_calon_karyawan tck where userid_ck=$1`,
        [userid_ck],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            if (results.rows[0].sudah_scan != 1) {
              // B
              pool.db_HCM.query(
                'select employee_id from trx_calon_karyawan where userid_ck=$1',
                [userid_ck],
                (error, results) => {
                  if (error) throw error;

                  if (results.rowCount > 0) {
                    const { employee_id } = results.rows[0];

                    // insert log activity user -- start
                    const data = {
                      employee_id,
                      menu: 'Scan Qr Calon Karyawan',
                    };

                    const options = {
                      headers: {
                        'Content-Type': 'application/json',
                        API_KEY: process.env.API_KEY,
                      },
                    };

                    axios
                      .post(
                        `${process.env.URL}/hcm/api/addLogUser`,
                        data,
                        options
                      )
                      .then((res) => {
                        console.log('RESPONSE ==== : ', res.data);
                      })
                      .catch((err) => {
                        console.error('ERROR: ====', err);
                        throw err;
                      });
                    // insert log activity user -- end

                    // D
                    pool.db_HCM.query(
                      'update trx_calon_karyawan set tgl_expired = current_date, tgl_scan_qr = current_date where userid_ck = $1',
                      [userid_ck],
                      (error) => {
                        if (error) throw error;

                        // C
                        pool.db_MMFPROD.query(
                          `select a.employee_id, b.display_name as nama, 
                          case when gender='1' then 'Laki-laki' when gender='2' then 'Wanita' end as gender ,
                          c.contact_value as no_hp, d.contact_value as email, e.company_office 
                          from employee_tbl a
                          left join person_tbl b on a.person_id = b.person_id 
                          left join person_contact_method_tbl c on b.person_id = c.person_id and c.default_address ='Y' and c.contact_type='3' 
                          left join person_contact_method_tbl d on b.person_id = d.person_id and d.default_address ='Y' and d.contact_type='4' 
                          left join emp_company_office_tbl e on a.employee_id = e.employee_id 
                          where a.employee_id =$1`,
                          [employee_id],
                          (error, results) => {
                            if (error) throw error;

                            if (results.rowCount > 0) {
                              const email_to = results.rows[0].email;

                              const subject_email =
                                'Informasi Karyawan Baru di PT Mandala Finance';

                              const emp_nokar = results.rows[0].employee_id;
                              const emp_password = emp_nokar;
                              const lms_password = 'Mandala-123';
                              const emp_name = results.rows[0].nama;
                              const emp_ph = results.rows[0].no_hp;

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
                                      (o) =>
                                        o.setting_name == 'Password Feedback'
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
                                        'Hallo sobat Mandala, selamat bergabung di PT Mandala Finance \n' +
                                        `${emp_name}, Sobat Mandala sudah dapat melakukan login di \n` +
                                        '*Apps MPower/Web Orange*\n' +
                                        `Nomor Karyawan : ${emp_nokar}\n` +
                                        `Password : ${emp_password}\n` +
                                        '\n' +
                                        '*Akses Learning Management System (LMS)*\n' +
                                        'di link http://lms.mandalafinance.com/\n' +
                                        `Userid : ${emp_nokar}\n` +
                                        `Password : ${lms_password}\n` +
                                        '\n' +
                                        'Human Resource PT Mandala Finance',
                                    };

                                    transporter.sendMail(
                                      mailOptions,
                                      (error) => {
                                        if (error) {
                                          console.error(
                                            'ERROR (email tidak ada): ====',
                                            error
                                          );

                                          response.status(500).send({
                                            status: 500,
                                            message:
                                              'Kami mengetahui bahwa email ini di sistem tidak ada!',
                                            validate_id: userid_ck,
                                            data: '',
                                          });
                                        }

                                        // insert wa message -- start
                                        const data = {
                                          to: emp_ph,
                                          header:
                                            'Informasi Karyawan Baru di PT Mandala Finance',
                                          text:
                                            'Hallo sobat Mandala, selamat bergabung di PT Mandala Finance,Sobat Mandala sudah dapat melakukan login di\n\n' +
                                            '*Apps MPower/Web Orange*\n' +
                                            `Nomor Karyawan : ${emp_nokar} \n` +
                                            `Password : ${emp_password}\n\n` +
                                            '*Akses Learning Management System (LMS)*\n' +
                                            'di link http://lms.mandalafinance.com/ \n' +
                                            `Userid : ${emp_nokar} \n` +
                                            `Password : ${lms_password}\n`,
                                          text2:
                                            '*Human Resource PT Mandala Finance*',
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
                                              validate_id: userid_ck,
                                              data: '',
                                            });
                                          });
                                        // insert wa message -- end

                                        response.status(200).send({
                                          status: 200,
                                          message:
                                            'Berhasil mengirim email dan whatsapp',
                                          data: '',
                                        });
                                      }
                                    );
                                  } else {
                                    response.status(200).send({
                                      status: 200,
                                      message: 'Data Tidak Ditemukan',
                                      data: '',
                                    });
                                  }
                                }
                              );
                            } else {
                              response.status(200).send({
                                status: 200,
                                message: 'Data Tidak Ditemukan',
                                validate_id: userid_ck,
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
                      message: 'Data Tidak Ditemukan',
                      validate_id: userid_ck,
                      data: '',
                    });
                  }
                }
              );
            } else {
              response.status(200).send({
                status: 200,
                message: 'already scanned',
                validate_id: userid_ck,
                data: results.rows[0],
              });
            }
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: userid_ck,
              data: '',
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
