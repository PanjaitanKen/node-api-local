// Tabel: HCM.trx_komplain
const pool = require('../../db');

const controller = {
  index(_, response) {
    try {
      pool.db_HCM.query(
        'SELECT id_komplain, cabang, no_hp, email, keterangan, tgl_komplain, internal_title, nama_karyawan FROM trx_komplain ORDER BY trx_komplain DESC',
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
