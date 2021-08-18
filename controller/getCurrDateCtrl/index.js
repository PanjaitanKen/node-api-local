const pool = require('../../db');

// Tabel : -
const controller = {
  async getCurrDate(request, response) {
    try {
      const query =
        'select current_timestamp as tgl1,current_date tgl2, timeofday()  as tgl3, NOW()::TIMESTAMP tgl4 from dual';

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
