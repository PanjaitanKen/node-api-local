const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getTokenNotif(request, response) {
    try {
      pool.db_HCM.query(
        `select token_notification from trx_notification`,
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: results.rows,
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
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
