const pool = require('../../db');

// Tabel : mas_kategori_komplain
const controller = {
  getKategori_Komplain(request, response) {
    try {
      pool.db_HCM.query(
        `select id_kategori_komplain,ket_kategori, email_to,cc_to, subject_email
          from mas_kategori_komplain mkk
          order by id_kategori_komplain`,
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
