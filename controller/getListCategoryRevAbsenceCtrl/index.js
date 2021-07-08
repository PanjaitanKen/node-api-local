const pool = require('../../db');

// Tabel : Param_HCM
const controller = {
  getListCategoryRevAbsence(request, response) {
    try {
      pool.db_HCM.query(
        `select  id_jenis_perbaikan ,ket_perbaikan 
        from mas_jenis_perbaikan_absen`,
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
