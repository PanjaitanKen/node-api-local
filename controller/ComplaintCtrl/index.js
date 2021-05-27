// Tabel: HCM.trx_komplain
const pool = require('../../db');

const controller = {
  index(_, response) {
    try {
      pool.db_HCM.query(
        `SELECT id_komplain,
          ket_kategori,
          nama_karyawan,
          email,
          trx_komplain.no_hp,
          cabang,
          keterangan,
          tgl_komplain,
          internal_title
          FROM trx_komplain
          LEFT JOIN mas_kategori_komplain ON trx_komplain.id_kategori_komplain = mas_kategori_komplain.id_kategori_komplain
          ORDER BY trx_komplain.tgl_komplain DESC`,
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: true,
              message: 'GET ALL COMPLAINT',
              data: results.rows,
            });
          } else {
            response.status(500).send({
              status: false,
              message: 'COMPLAINT NOT FOUND',
              data: [],
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
