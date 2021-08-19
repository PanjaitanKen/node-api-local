const pool = require('../../db');

// Tabel : user_config_tbl
const controller = {
  async checkPass_Rules(request, response) {
    try {
      const query =
        'select enable_rule ,mix_letter ,contain_number ,contain_char ,password_length from user_config_tbl';

      await pool.db_MMFPROD
        .query(query)
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: rows[0],
            });
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
};

module.exports = controller;
