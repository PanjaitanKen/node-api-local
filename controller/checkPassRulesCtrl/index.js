const pool = require('../../db');

// Tabel : user_config_tbl
const controller = {
  checkPass_Rules(request, response) {
    try {
      pool.db_MMFPROD.query(
        'select enable_rule ,mix_letter ,contain_number ,contain_char ,password_length from user_config_tbl',
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: results.rows[0],
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
