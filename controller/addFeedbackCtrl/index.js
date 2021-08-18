const nodemailer = require('nodemailer');
const dateFormat = require('dateformat');
const _ = require('lodash');
const { validationResult } = require('express-validator');
const axios = require('axios');
const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  async addFeedback(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    try {
      const {
        employee_id,
        id_kategori_komplain,
        information_data,
        id_session,
      } = request.body;

      //insert log activity user -- start
      const data = {
        employee_id: employee_id,
        menu: 'Feedback',
      };

      const options = {
        headers: {
          'Content-Type': 'application/json',
          API_KEY: process.env.API_KEY,
        },
      };

      axios
        .post(process.env.URL + '/hcm/api/addLogUser', data, options)
        .then((res) => {
          console.log('RESPONSE ==== : ', res.data);
        })
        .catch((err) => {
          console.log('ERROR: ====', err);
        });
      //insert log activity user -- end

      if (
        // eslint-disable-next-line eqeqeq
        id_kategori_komplain != '' &&
        // eslint-disable-next-line eqeqeq
        id_kategori_komplain != ' ' &&
        // eslint-disable-next-line no-restricted-globals
        !isNaN(id_kategori_komplain) &&
        id_kategori_komplain != null
      ) {
        const query =
          'select b.employee_id ,e.display_name,d.company_office cabang, ' +
          "case when left(coalesce(coalesce(c.email_value1,c.email_value2),a.contact_value),1)<>'0' then " +
          "coalesce(coalesce(c.email_value1,c.email_value2),a.contact_value) else ' ' end " +
          'as email ' +
          'from person_contact_method_tbl a ' +
          'left join employee_tbl b on  a.person_id =b.person_id  ' +
          'left join my_contact_method_tbl c on a.person_id = c.person_id  ' +
          'left join emp_company_office_tbl d on b.employee_id =d.employee_id  and current_date between valid_from and valid_to ' +
          'left join person_tbl e on a.person_id =e.person_id ' +
          "where b.employee_id =$1 and  a.contact_type ='4' " +
          'limit 1 ';

        await pool.db_MMFPROD
          .query(query, [employee_id])
          .then(({ rows }) => {
            // eslint-disable-next-line eqeqeq
            if (rows != '') {
              const emp_cabang = rows[0].cabang;
              const emp_displayName = rows[0].display_name;
              const emp_email = rows[0].email ? rows[0].email : '-';
              pool.db_HCM.query(
                'select * from mas_kategori_komplain where id_kategori_komplain =$1 ',
                [id_kategori_komplain],
                (error, results) => {
                  if (error) {
                    throw error;
                  }
                  // eslint-disable-next-line eqeqeq
                  if (results.rows != '') {
                    const { email_to, cc_to, subject_email } = results.rows[0];
                    const cc_receipt = cc_to + ', ' + emp_email;
                    pool.db_MMFPROD.query(
                      'select a.position_id , b.internal_title ' +
                        'from employee_position_tbl a ' +
                        'left join position_tbl b on a.position_id = b.position_id ' +
                        'where employee_id =$1 and current_date between a.valid_from and a.valid_to ',
                      [employee_id],
                      (error, results) => {
                        if (error) {
                          throw error;
                        }
                        // eslint-disable-next-line eqeqeq
                        if (results.rows != '') {
                          const positionId = results.rows[0].position_id;
                          const internalTitle = results.rows[0].internal_title;
                          const day = dateFormat(
                            new Date(),
                            'yyyy-mm-dd hh:MM:ss'
                          );
                          pool.db_HCM.query(
                            'insert into trx_komplain (cabang,employee_id , email ,id_kategori_komplain ,keterangan, tgl_komplain , id_session ,transfer_message,position_id, internal_title, nama_karyawan) ' +
                              'values ($1, $2 , $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                            [
                              emp_cabang,
                              employee_id,
                              emp_email,
                              id_kategori_komplain,
                              information_data,
                              day,
                              id_session,
                              '0',
                              positionId,
                              internalTitle,
                              emp_displayName,
                            ],
                            (error) => {
                              if (error) {
                                throw error;
                              } else {
                                pool.db_HCM.query(
                                  'select id_komplain from trx_komplain where tgl_komplain =$1',
                                  [day],
                                  (error, results) => {
                                    if (error) {
                                      throw error;
                                    }
                                    // eslint-disable-next-line eqeqeq
                                    if (results.rows != '') {
                                      const { id_komplain } = results.rows[0];

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
                                                return (
                                                  o.setting_name ==
                                                  'Host Feedback'
                                                );
                                              }
                                            );
                                            //map userMailValue
                                            const userMailValue = _.filter(
                                              results.rows,
                                              function (o) {
                                                return (
                                                  o.setting_name ==
                                                  'Email Feedback'
                                                );
                                              }
                                            );
                                            //map passwordMailValue
                                            const passwordMailValue = _.filter(
                                              results.rows,
                                              function (o) {
                                                return (
                                                  o.setting_name ==
                                                  'Password Feedback'
                                                );
                                              }
                                            );

                                            const hostMail =
                                              hostMailValue[0].setting_value;
                                            const userMail =
                                              userMailValue[0].setting_value;
                                            const passwordMail =
                                              passwordMailValue[0]
                                                .setting_value;
                                            const transporter = nodemailer.createTransport(
                                              {
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
                                              }
                                            );

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
                                                `Tanggal: ${day}\n` +
                                                '\n' +
                                                `Feedback: ${information_data}\n`,
                                            };

                                            transporter.sendMail(
                                              mailOptions,
                                              (error, info) => {
                                                if (error) {
                                                  response.status(200).send({
                                                    status: 200,
                                                    message:
                                                      'Belum terkoneksi dengan email',
                                                    data: '',
                                                  });
                                                }
                                                const resp_api_email =
                                                  info.response;
                                                pool.db_HCM.query(
                                                  'UPDATE trx_komplain ' +
                                                    'SET transfer_message = $1' +
                                                    'WHERE tgl_komplain = $2',
                                                  [resp_api_email, day],
                                                  (error) => {
                                                    if (error) {
                                                      throw error;
                                                    }
                                                    response.status(200).send({
                                                      status: 200,
                                                      message:
                                                        'Berhasil mengirim email dan masuk kedalam tabel',
                                                      data: '',
                                                    });
                                                  }
                                                );
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
                                        data: '',
                                      });
                                    }
                                  }
                                );
                              }
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
                      data: '',
                    });
                  }
                }
              );
            } else {
              response.status(200).send({
                status: 200,
                message: 'Data Tidak Ditemukan',
                data: '',
              });
            }
          })
          .catch((error) => {
            throw error;
          });
      } else {
        response.status(200).send({
          status: 200,
          message: 'id_kategori_komplain kosong',
          data: '',
        });
      }
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
