const pool = require('../../db');

// Tabel : session_tracking_tbl
const controller = {
  checkEmployeeLogin(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_HCM.query(
        ' select count(*) jumlah from mas_karyawan_uat where employee_code = $1',
        [employee_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: results.rows[0],
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
