/* eslint-disable new-cap */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-inner-declarations */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable object-curly-newline */
/* eslint-disable no-plusplus */
const fcm = require('fcm-notification');
const _ = require('lodash');
const pool = require('../../db');
const Helpers = require('../../helpers');

const FCM = new fcm('./privateKey.json');

const controller = {
  async pushNotification(request, response) {
    try {
      const {
        employee_id,
        submission_type,
        employee_name,
        submission_id,
        submission_status,
      } = request.body;

      let msg_body = '';
      if (submission_id == '1') {
        msg_body = `telah mengajukan ${submission_type} dan membutuhkan approval`;
      } else if (submission_id == '2') {
        msg_body = `pengajuan ${submission_type} kamu telah ${submission_status}`;
      }

      const query =
        'select supervisor_id from employee_supervisor_tbl where employee_id = $1 and current_date between valid_from  and valid_to ';

      await pool.db_MMFPROD
        .query(query, [employee_id])
        .then(({ rowCount, rows }) => {
          if (rowCount > 0) {
            const employee_token =
              submission_id == '1' ? rows[0].supervisor_id : employee_id;
            pool.db_HCM.query(
              'SELECT token_notification FROM trx_notification WHERE employee_id = $1 AND token_notification IS NOT NULL',
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
                      body: `${_.startCase(employee_name)} ${msg_body} `,
                    },
                    notification: {
                      title: `Approval Pengajuan ${_.startCase(
                        submission_type
                      )}`,
                      body: `${_.startCase(employee_name)} ${msg_body} `,
                    },
                    token,
                  };
                  FCM.send(message, async (err, result) => {
                    const dataLog = {
                      data: { employee_id },
                      response: result || err,
                    };
                    if (err) {
                      Helpers.logger(
                        'ERROR',
                        dataLog,
                        'pushNotificationCtrl.pushNotification',
                        'Push Notification'
                      );

                      await pool.db_HCM.query(
                        'INSERT INTO log_notif (tanggal, response, status) VALUES (CURRENT_DATE, $1, false)',
                        [
                          JSON.stringify({
                            ...dataLog,
                            end_point: '/hcm/api/pushNotification',
                          }),
                        ]
                      );
                      response.status(200).send({
                        status: 200,
                        message: 'Token is not valid',
                        data: err,
                      });
                    } else {
                      Helpers.logger(
                        'SUCCESS',
                        dataLog,
                        'pushNotificationCtrl.pushNotification',
                        'Push Notification'
                      );

                      await pool.db_HCM.query(
                        'INSERT INTO log_notif (tanggal, response, status) VALUES (CURRENT_DATE, $1, true)',
                        [
                          JSON.stringify({
                            ...dataLog,
                            end_point: '/hcm/api/pushNotification',
                          }),
                        ]
                      );
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
        })
        .catch((error) => {
          throw error;
        });
    } catch (err) {
      response.status(500).send(err);
    }
  },
  pushNotifNewsEvent(request, response) {
    try {
      const { jenis, ket1, ket2, nobukti, golid, approved_date } = request.body;

      pool.db_HCM.query(
        'select employee_id, token_notification from trx_notification where token_notification is not null',
        async (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            const dataNotifications = [];

            for (let i = 0; i < results.rowCount; i++) {
              dataNotifications.push({
                employee_id: results.rows[i].employee_id,
                token_notification: results.rows[i].token_notification,
              });

              pool.db_HCM.query(
                `insert into temp_notif (employee_id, jenis, ket1, ket2, nobukti, golid, approved_date, sudah_baca)
                values ($1, $2, $3, $4, $5, $6, $7, null)`,
                [
                  results.rows[i].employee_id,
                  jenis,
                  ket1,
                  ket2,
                  nobukti,
                  golid,
                  approved_date,
                ],
                (error) => {
                  if (error) {
                    console.error('INSERT TEMP_NOTIF:', error);
                    throw error;
                  }
                }
              );
            }

            const message = {
              data: {
                score: '850',
                time: '2:45',
              },
              notification: {
                title: `${ket1}`,
                body: `${ket2}`,
              },
            };

            function __sendPushMultipleNotification(datas) {
              return new Promise((resolve, reject) => {
                const employee_ids = [];
                const token_notifications = [];

                for (let i = 0; i < datas.length; i++) {
                  employee_ids.push(datas[i].employee_id);
                  token_notifications.push(datas[i].token_notification);
                }

                FCM.sendToMultipleToken(
                  message,
                  token_notifications,
                  (error, results) => {
                    if (error) reject(error);

                    for (let i = 0; i < results.length; i++) {
                      const employee_id = employee_ids[i];
                      const { token, response } = results[i];

                      const dataLog = {
                        data: { employee_id, nobukti, token },
                        response,
                      };

                      Helpers.logger(
                        response.includes('Error') ? 'ERROR' : 'SUCCESS',
                        dataLog,
                        'pushNotificationCtrl.pushNotifNewsEvent',
                        'Push Notif News Event'
                      );

                      pool.db_HCM.query(
                        'INSERT INTO log_notif (tanggal, response, status) VALUES (CURRENT_DATE, $1, $2)',
                        [
                          JSON.stringify({
                            ...dataLog,
                            end_point: '/hcm/api/pushNotifNewsEvent',
                          }),
                          !response.includes('Error'),
                        ]
                      );
                    }

                    resolve(results);
                  }
                );
              });
            }

            const promises = _.map(_.chunk(dataNotifications, 500), (datas) => {
              return __sendPushMultipleNotification(datas);
            });

            await Promise.all(promises)
              .then((data) => {
                response.status(200).send({
                  status: 200,
                  message: 'PUSH NOTIFICATION SUCCESS',
                  data,
                });
              })
              .catch((error) => {
                response.status(500).send({
                  status: 500,
                  message: error,
                  data: [],
                });
              });
          } else {
            response.status(404).send({
              status: 404,
              message: 'DATA NOT FOUND',
              data: [],
            });
          }
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
  pushNotifBlastAll(request, response) {
    try {
      const { ket1, ket2 } = request.body;

      pool.db_HCM.query(
        'select employee_id, token_notification from trx_notification where token_notification is not null',
        async (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            const dataNotifications = [];

            for (let i = 0; i < results.rowCount; i++) {
              dataNotifications.push({
                employee_id: results.rows[i].employee_id,
                token_notification: results.rows[i].token_notification,
              });
            }

            const message = {
              data: {
                score: '850',
                time: '2:45',
              },
              notification: {
                title: `${ket1}`,
                body: `${ket2}`,
              },
            };

            function __sendPushMultipleNotification(datas) {
              return new Promise((resolve, reject) => {
                const employee_ids = [];
                const token_notifications = [];

                for (let i = 0; i < datas.length; i++) {
                  employee_ids.push(datas[i].employee_id);
                  token_notifications.push(datas[i].token_notification);
                }

                FCM.sendToMultipleToken(
                  message,
                  token_notifications,
                  (error, results) => {
                    if (error) reject(error);

                    for (let i = 0; i < results.length; i++) {
                      const employee_id = employee_ids[i];
                      const { token, response } = results[i];

                      const dataLog = {
                        data: { employee_id, ket1, ket2, token },
                        response,
                      };

                      Helpers.logger(
                        response.includes('Error') ? 'ERROR' : 'SUCCESS',
                        dataLog,
                        'pushNotificationCtrl.pushNotifBlastAll',
                        'Push Notif Blast All'
                      );

                      pool.db_HCM.query(
                        'INSERT INTO log_notif (tanggal, response, status) VALUES (CURRENT_DATE, $1, $2)',
                        [
                          JSON.stringify({
                            ...dataLog,
                            end_point: '/hcm/api/pushNotifBlastAll',
                          }),
                          !response.includes('Error'),
                        ]
                      );
                    }

                    resolve(results);
                  }
                );
              });
            }

            const promises = _.map(_.chunk(dataNotifications, 500), (datas) => {
              return __sendPushMultipleNotification(datas);
            });

            await Promise.all(promises)
              .then((data) => {
                response.status(200).send({
                  status: 200,
                  message: 'PUSH NOTIFICATION SUCCESS',
                  data,
                });
              })
              .catch((error) => {
                response.status(500).send({
                  status: 500,
                  message: error,
                  data: [],
                });
              });
          } else {
            response.status(404).send({
              status: 404,
              message: 'DATA NOT FOUND',
              data: [],
            });
          }
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
  pNRevAbsen(request, response) {
    try {
      const { employee_id, employee_name, submission_id } = request.body;

      let msg_body = '';
      if (submission_id == '1') {
        msg_body = `${_.startCase(
          employee_name
        )} telah mengajukan Perbaikan Absen`;
      } else if (submission_id == '2') {
        msg_body = `${_.startCase(
          employee_name
        )} pengajuan Perbaikan Absen kamu telah di 'Approved'`;
      } else if (submission_id == '3') {
        msg_body = `${_.startCase(
          employee_name
        )}pengajuan Perbaikan Absen kamu telah di 'Reject'`;
      } else if (submission_id == '4') {
        msg_body = `${_.startCase(
          employee_name
        )} Pengajuan Perbaikan Absen 'Approved/Rejected'`;
      } else if (submission_id == '5') {
        msg_body = `Pengajuan Perbaikan Absen atas nama ${_.startCase(
          employee_name
        )} `;
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
              submission_id == '1' || submission_id == '5'
                ? results.rows[0].supervisor_id
                : employee_id;
            pool.db_HCM.query(
              'SELECT token_notification FROM trx_notification WHERE employee_id = $1 AND token_notification IS NOT NULL',
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
                      title: 'Pengajuan Perbaikan Absen',
                      body: `${msg_body} `,
                    },
                    notification: {
                      title: 'Pengajuan Perbaikan Absen',
                      body: `${msg_body} `,
                    },
                    token,
                  };
                  FCM.send(message, async (err, result) => {
                    const dataLog = {
                      data: { employee_id },
                      response: result || err,
                    };
                    if (err) {
                      Helpers.logger(
                        'ERROR',
                        dataLog,
                        'pushNotificationCtrl.pNRevAbsen',
                        'Push Notif Rev Absen'
                      );

                      await pool.db_HCM.query(
                        'INSERT INTO log_notif (tanggal, response, status) VALUES (CURRENT_DATE, $1, false)',
                        [
                          JSON.stringify({
                            ...dataLog,
                            end_point: '/hcm/api/pNRevAbsen',
                          }),
                        ]
                      );
                      response.status(200).send({
                        status: 200,
                        message: 'Token is not valid',
                        data: err,
                      });
                    } else {
                      Helpers.logger(
                        'SUCCESS',
                        dataLog,
                        'pushNotificationCtrl.pNRevAbsen',
                        'Push Notif Rev Absen'
                      );

                      await pool.db_HCM.query(
                        'INSERT INTO log_notif (tanggal, response, status) VALUES (CURRENT_DATE, $1, true)',
                        [
                          JSON.stringify({
                            ...dataLog,
                            end_point: '/hcm/api/pNRevAbsen',
                          }),
                        ]
                      );
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
};

module.exports = controller;
