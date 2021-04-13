const nodemailer = require('nodemailer');
const pool = require('../../db');
const _ = require('lodash');
const { validationResult } = require('express-validator');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  resendFeedback(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    try {
      const { id_komplain } = request.body;

      pool.db_HCM.query(
        `select *  from trx_komplain where id_komplain = $1 `,
        [id_komplain],
        (error, results) => {
          if (error) {
            throw error;
          } else {
            const {
              employee_id,
              id_kategori_komplain,
              keterangan,
              positionId,
              internalTitle,
              tanggal_komplain,
            } = results.rows[0];
            const emp_cabang = results.rows[0].cabang;
            const emp_displayName = results.rows[0].nama_karyawan;
            const emp_email = results.rows[0].email
              ? results.rows[0].email
              : '-';
            pool.db_HCM.query(
              'select * from mas_kategori_komplain where id_kategori_komplain =$1 ',
              [id_kategori_komplain],
              (error, results) => {
                if (error) {
                  throw error;
                }
                if (results.rows != 0) {
                  const { email_to, cc_to, subject_email } = results.rows[0];
                  const cc_receipt = cc_to + ', ' + emp_email;
                  // eslint-disable-next-line eqeqeq
                  pool.db_HCM.query(
                    'select * from param_hcm ',
                    (error, results) => {
                      if (error) {
                        throw error;
                      }
                      // eslint-disable-next-line eqeqeq
                      if (results.rows != '') {
                        //map hostmail
                        const hostMailValue = _.filter(
                          results.rows,
                          function (o) {
                            return o.setting_name == 'Host Feedback';
                          }
                        );
                        //map userMailValue
                        const userMailValue = _.filter(
                          results.rows,
                          function (o) {
                            return o.setting_name == 'Email Feedback';
                          }
                        );
                        //map passwordMailValue
                        const passwordMailValue = _.filter(
                          results.rows,
                          function (o) {
                            return o.setting_name == 'Password Feedback';
                          }
                        );

                        const hostMail = hostMailValue[0].setting_value;
                        const userMail = userMailValue[0].setting_value;
                        const passwordMail = passwordMailValue[0].setting_value;
                        const transporter = nodemailer.createTransport({
                          // service: 'gmail',
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
                        });

                        const mailOptions = {
                          from: userMail,
                          to: email_to,
                          cc: cc_receipt,
                          subject: subject_email,
                          text:
                            `No Feedback: ${id_komplain}\n` +
                            `Cabang: ${emp_cabang}\n` +
                            `Employee Id: ${employee_id} ` +
                            '-' +
                            ` ${emp_displayName}\n` +
                            `Email: ${emp_email}\n` +
                            `Jabatan: ${positionId}-${internalTitle}\n` +
                            `Tanggal: ${tanggal_komplain}\n` +
                            '\n' +
                            `Feedback: ${keterangan}\n`,
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                          const resp_api_email = info.response;
                          pool.db_HCM.query(
                            'UPDATE trx_komplain ' +
                              'SET transfer_message = $1' +
                              'WHERE tgl_komplain = $2',
                            [resp_api_email, tanggal_komplain],
                            (error) => {
                              if (error) {
                                throw error;
                              }
                              response.status(200).send({
                                status: 200,
                                message:
                                  'Berhasil mengirim email dan masuk kedalam tabel',
                                data: info.response,
                              });
                            }
                          );
                        });
                      } else {
                        response.status(200).send({
                          status: 200,
                          message: 'Data Tidak Ditemukan',
                          data: results.rows,
                        });
                      }
                    }
                  );
                } else {
                  response.status(200).send({
                    status: 200,
                    message: 'Data Tidak Ditemukan',
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
