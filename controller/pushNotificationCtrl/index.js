const fcm = require('fcm-notification');
const _ = require('lodash');
const { token } = require('morgan');
const pool = require('../../db');

// eslint-disable-next-line new-cap
const FCM = new fcm('./privateKey.json');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  pushNotification(request, response) {
    try {
      const {
        employee_id,
        submission_type,
        employee_name,
        submission_id,
        submission_status,
      } = request.body;

      if (submission_id == '1') {
        var msg_body = `telah mengajukan ${submission_type} dan membutuhkan approval`;
      } else if (submission_id == '2') {
        var msg_body = `pengajuan ${submission_type} kamu telah ${submission_status}`;
      }

      pool.db_MMFPROD.query(
        'select supervisor_id from employee_supervisor_tbl where employee_id = $1 and current_date between valid_from  and valid_to ',
        [employee_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          if (results.rowCount > 0) {
            const employee_token =
              submission_id == '1'
                ? results.rows[0].supervisor_id
                : employee_id;
            pool.db_HCM.query(
              'SELECT token_notification FROM trx_notification where employee_id =$1',
              [employee_token],
              (error, results) => {
                if (error) {
                  throw error;
                }
                if (results.rowCount > 0) {
                  const token = results.rows[0].token_notification;
                  const message = {
                    data: {
                      // This is only optional, you can send any data
                      title: `Approval Pengajuan ${_.startCase(
                        submission_type
                      )}`,
                      // eslint-disable-next-line block-scoped-var
                      body: `${_.startCase(employee_name)} ${msg_body} `,
                    },
                    notification: {
                      title: `Approval Pengajuan ${_.startCase(
                        submission_type
                      )}`,
                      // eslint-disable-next-line block-scoped-var
                      body: `${_.startCase(employee_name)} ${msg_body} `,
                    },
                    token,
                  };
                  FCM.send(message, (err, result) => {
                    if (err) {
                      response.status(200).send({
                        status: 200,
                        message: 'Token is not valid',
                        data: err,
                      });
                    } else {
                      response.status(200).send({
                        status: 200,
                        message: 'Load Data berhasil',
                        data: result,
                      });
                    }
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
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              data: '',
            });
          }
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },

  pushNotifNewsEvent(request, response) {
    try {
      const { jenis, ket1, ket2, nobukti, golid, approved_date } = request.body;

      pool.db_HCM.query(
        'select employee_id, token_notification from trx_notification',
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            let arr = [];
            let employee_tokens = [];
            const employee_id = results.rows;

            arr = employee_id.map(function (a) {
              const employee_id = a.employee_id;
              pool.db_HCM.query(
                `insert into temp_notif (employee_id ,jenis , ket1 ,ket2 ,nobukti , golid , approved_date ,sudah_baca )
                values ($1 ,$2,$3,$4,$5,$6,$7,null)`,
                [employee_id, jenis, ket1, ket2, nobukti, golid, approved_date],
                (error, results) => {
                  if (error) throw error;
                }
              );
              return {
                employee_id: a.employee_id,
                jenis: jenis,
                ket1: ket1,
                ket2: ket2,
                nobukti: nobukti,
                golid: golid,
                approved_date: approved_date,
              };
            });
            employee_tokens = employee_id.map(function (a) {
              const bb = a.token_notification;
              return bb;
            });
            const message = {
              data: {
                score: '850',
                time: '2:45',
              },
              notification: {
                title: `${ket1}`,
                // eslint-disable-next-line block-scoped-var
                body: `${ket2}`,
              },
            };
            FCM.sendToMultipleToken(
              message,
              employee_tokens,
              (err, results) => {
                if (err) {
                  response.status(200).send({
                    status: 200,
                    message: 'Token is not valid',
                    data: err,
                  });
                } else {
                  response.status(200).send({
                    status: 200,
                    message: 'Load Data berhasil',
                    data: results,
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
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
