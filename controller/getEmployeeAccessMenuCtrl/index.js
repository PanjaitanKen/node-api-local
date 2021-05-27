const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getEmployeeAccessMenu(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_HCM.query(
        `select case when tgl_akses is null then 0 else 1 end as akses from trx_akses_menu_ck where userid_ck =$1`,
        [employee_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: Object.values(results.rows).map(Object.values),
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
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
