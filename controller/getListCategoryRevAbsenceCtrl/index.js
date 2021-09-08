const pool = require('../../db');

// Tabel : Param_HCM
const controller = {
  async getListCategoryRevAbsence(request, response) {
    try {
      const query = `select  id_jenis_perbaikan ,ket_perbaikan 
        from mas_jenis_perbaikan_absen`;
      await pool.db_HCM
        .query(query)
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: rows,
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
