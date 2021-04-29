const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  updateAbsenceCat(request, response) {
    try {
      const { absen_code } = request.body;

      pool.db_HCM.query(
        `update param_hcm set setting_value = $1 where setting_name ='AKTIF JENIS ABSEN'`,
        [absen_code],
        (error, results) => {
          if (error) {
            throw error;
          }
          // eslint-disable-next-line eqeqeq
          response.status(200).send({
            status: 200,
            message: 'Berhasil memperbaharui data tabel',
            data: '',
          });
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
