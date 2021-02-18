const pool = require('../../db');

// Tabel : trx_notification

const controller = {
  checkToken_Notif(request, response) {
    const { employee_id, token_notif } = request.body;

    pool.db_HCM.query(
      'SELECT token_notification FROM trx_notification where employee_id =$1',
      [employee_id],
      (error, results) => {
        if (error) throw error;

        if (results.rowCount > 0) {
          // eslint-disable-next-line eqeqeq
          if (results.rows[0].token_notification != token_notif) {
            pool.db_HCM.query(
              'update trx_notification set token_notification=$2 where employee_id=$1 ',
              [employee_id, token_notif],
              (error) => {
                if (error) throw error;

                response.status(201).send({
                  status: 201,
                  message: 'Update Token Berhasil',
                });
              }
            );
          } else {
            response.status(202).send({
              status: 202,
              message: 'Token sudah sesuai',
            });
          }
        } else {
          pool.db_HCM.query(
            'insert into trx_notification (employee_id,token_notification) values ($1, $2 );',
            [employee_id, token_notif],
            (error) => {
              if (error) throw error;

              response.status(201).send({
                status: 201,
                message: 'Token Berhasil di insert',
              });
            }
          );
        }
      }
    );
  },
};

module.exports = controller;
