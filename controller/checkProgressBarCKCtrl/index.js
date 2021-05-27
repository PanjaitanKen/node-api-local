const pool = require('../../db');
const { validationResult } = require('express-validator');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  checkProgressBarCK(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    try {
      const { employee_id } = request.body;

      pool.db_HCM.query(
        `with x as (select 
          (select 
           count(*) jumlah_konfirm
           from trx_akses_menu_ck
           where userid_ck = $1 
           and tgl_akses is not null) jumlah_konfirm,
           count(case when userid_ck = $1 then 1 else 0 end) jumlah_menu
           from trx_akses_menu_ck
        where userid_ck = $1 )
        select (jumlah_konfirm/jumlah_menu)*100 persen_progress 
        from x`,
        [employee_id],
        (error, results) => {
          if (error) throw error;

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
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
