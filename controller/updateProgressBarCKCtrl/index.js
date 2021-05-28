const pool = require('../../db');
const { validationResult } = require('express-validator');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  updateProgressBarCK(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    try {
      const { employee_id, id_menu_ck } = request.body;

      pool.db_HCM.query(
        `select count(*) sudah_akses from trx_akses_menu_ck
        where userid_ck = $1 and id_menu_ck =$2
        and tgl_akses is not null`,
        [employee_id, id_menu_ck],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            if (results.rows[0].sudah_akses >= 1) {
              response.status(200).send({
                status: 200,
                message: 'Load Data berhasil',
                validate_id: employee_id,
                data: results.rows[0],
              });
            } else {
              pool.db_HCM.query(
                `update trx_akses_menu_ck set tgl_akses =current_date
                where userid_ck = $1 and id_menu_ck =$2`,
                [employee_id, id_menu_ck],
                (error, results) => {
                  if (error) throw error;

                  // eslint-disable-next-line eqeqeq
                  response.status(202).send({
                    status: 'SUCCESS',
                    message: 'UPDATE USER',
                    validate_id: employee_id,
                    data: '',
                  });
                }
              );
            }
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
