const pool = require('../../db');

// Tabel : mas_kategori_komplain
const controller = {
  async getKategori_Komplain(request, response) {
    try {
      const query = `select id_kategori_komplain,ket_kategori, email_to,cc_to, subject_email
          from mas_kategori_komplain mkk
          order by id_kategori_komplain`;

      await pool.db_HCM
        .query(query)
        .then(({ rows }) => {
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
