const fcm = require('fcm-notification');
const _ = require('lodash');
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
        "select supervisor_id from employee_supervisor_tbl where employee_id = $1 and valid_to=date'9999-01-01'",
        [employee_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          if (results.rowCount > 0) {
            const employee_supervisor = results.rows[0].supervisor_id;
            pool.db_HCM.query(
              'SELECT token_notification FROM trx_notification where employee_id =$1',
              [employee_supervisor],
              (error, results) => {
                if (error) {
                  throw error;
                }
                if (results.rowCount > 0) {
                  const token = results.rows[0].token_notification;
                  const message = {
                    data: {
                      // This is only optional, you can send any data
                      score: '850',
                      time: '2:45',
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
};

module.exports = controller;
