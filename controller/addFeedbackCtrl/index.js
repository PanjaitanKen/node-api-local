const nodemailer = require('nodemailer');
const dateFormat = require('dateformat');
const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  addFeedback(request, response) {
    try {
      const {
        employee_id,
        id_kategori_komplain,
        information_data,
        id_session,
        number_phone,
      } = request.body;

      if (
        id_kategori_komplain != '' &&
        id_kategori_komplain != ' ' &&
        // eslint-disable-next-line no-restricted-globals
        !isNaN(id_kategori_komplain) &&
        id_kategori_komplain != null
      ) {
        pool.db_MMFPROD.query(
          'select b.employee_id ,e.display_name,d.company_office cabang, ' +
            "case when left(coalesce(coalesce(c.email_value1,c.email_value2),a.contact_value),1)<>'0' then " +
            "coalesce(coalesce(c.email_value1,c.email_value2),a.contact_value) else ' ' end " +
            'as email ' +
            'from person_contact_method_tbl a ' +
            'left join employee_tbl b on  a.person_id =b.person_id  ' +
            'left join my_contact_method_tbl c on a.person_id = c.person_id  ' +
            'left join emp_company_office_tbl d on b.employee_id =d.employee_id  ' +
            'left join person_tbl e on a.person_id =e.person_id ' +
            "where b.employee_id =$1 and  a.contact_type ='4' " +
            'limit 1 ',
          [employee_id],
          (error, results) => {
            if (error) {
              throw error;
            }
            if (results.rows != '') {
              const emp_cabang = results.rows[0].cabang;
              const emp_displayName = results.rows[0].display_name;
              const emp_email = results.rows[0].email;

              pool.db_HCM.query(
                'select * from mas_kategori_komplain where id_kategori_komplain =$1 ',
                [id_kategori_komplain],
                (error, results) => {
                  if (error) {
                    throw error;
                  }
                  if (results.rows != '') {
                    const { email_to, cc_to, subject_email } = results.rows[0];

                    pool.db_MMFPROD.query(
                      'select a.position_id , b.internal_title ' +
                        'from employee_position_tbl a ' +
                        'left join position_tbl b on a.position_id = b.position_id ' +
                        'where employee_id =$1',
                      [employee_id],
                      (error, results) => {
                        if (error) {
                          throw error;
                        }
                        if (results.rows != '') {
                          const positionId = results.rows[0].position_id;
                          const internalTitle = results.rows[0].internal_title;
                          const day = dateFormat(
                            new Date(),
                            'yyyy-mm-dd hh:MM:ss'
                          );
                          pool.db_HCM.query(
                            'insert into trx_komplain (cabang,employee_id ,no_hp , email ,id_kategori_komplain ,keterangan, tgl_komplain , id_session ,transfer_message,position_id, internal_title, nama_karyawan) ' +
                              'values ($1, $2 , $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
                            [
                              emp_cabang,
                              employee_id,
                              number_phone,
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
                                    if (results.rows != '') {
                                      const { id_komplain } = results.rows[0];

                                      pool.db_HCM.query(
                                        'select * from param_hcm ',
                                        (error, results) => {
                                          if (error) {
                                            throw error;
                                          }
                                          if (results.rows != '') {
                                            const hostMail =
                                              results.rows[3].setting_value;
                                            const userMail =
                                              results.rows[4].setting_value;
                                            const passwordMail =
                                              results.rows[5].setting_value;
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
                                              cc: cc_to,
                                              subject: subject_email,
                                              text:
                                                `No Feedback: ${id_komplain}\n` +
                                                `Cabang: ${emp_cabang}\n` +
                                                `Employee Id: ${employee_id} ` +
                                                '-' +
                                                ` ${emp_displayName}\n` +
                                                `Email: ${emp_email}\n` +
                                                `No HP: ${number_phone}\n` +
                                                `Jabatan: ${positionId}-${internalTitle}\n` +
                                                `Tanggal: ${day}\n` +
                                                '\n' +
                                                `Feedback: ${information_data}\n`,
                                            };

                                            transporter.sendMail(
                                              mailOptions,
                                              (error, info) => {
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
