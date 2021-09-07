const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  async updateAbsenceCat(request, response) {
    try {
      const { absen_code } = request.body;

      const query = `update param_hcm set setting_value = $1 where setting_name ='AKTIF JENIS ABSEN'`;
      await pool.db_HCM
        .query(query, [absen_code])
        .then(() => {
          // eslint-disable-next-line eqeqeq
          response.status(200).send({
            status: 200,
            message: 'Berhasil memperbaharui data tabel',
            data: '',
          });
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
