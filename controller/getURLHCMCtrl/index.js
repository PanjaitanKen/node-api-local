const pool = require('../../db');

// Tabel : Param_HCM
const controller = {
  async getURL_HCM(request, response) {
    try {
      const query =
        "select setting_value as url_hcm from param_hcm where setting_name ='URL API HCM'";
      await pool.db_HCM
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
