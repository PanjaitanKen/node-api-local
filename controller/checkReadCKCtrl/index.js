const { validationResult } = require('express-validator');
const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  async checkReadCK(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    try {
      const { employee_id } = request.body;

      const query = `select case when tgl_akses is null then 0 else 1 end as akses from trx_akses_menu_ck where userid_ck =$1 order by id_menu_ck asc`;
      await pool.db_HCM
        .query(query, [employee_id])
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            let employee_akses = [];
            employee_akses = rows.map(function (a) {
              const bb = a.akses;
              return bb;
            });
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: employee_akses,
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: employee_id,
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
