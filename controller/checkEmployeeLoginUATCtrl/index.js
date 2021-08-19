const pool = require('../../db');

// Tabel : session_tracking_tbl
const controller = {
  async checkEmployeeLogin(request, response) {
    try {
      const { employee_id } = request.body;

      const query = ' select count(*) jumlah from mas_karyawan_uat';

      await pool.db_HCM
        .query(query)
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows[0].jumlah != 0) {
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
                    validate_id: employee_id,
                    data: results.rows[0],
                  });
                } else {
                  response.status(200).send({
                    status: 200,
                    message: 'Data Tidak Ditemukan',
                    validate_id: employee_id,
                    data: results.rows,
                  });
                }
              }
            );
          } else {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: { jumlah: '1' },
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
