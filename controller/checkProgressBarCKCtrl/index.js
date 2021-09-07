const { validationResult } = require('express-validator');
const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  async checkProgressBarCK(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    try {
      const { employee_id } = request.body;

      const query = `with x as (select 
          (select 
            count(*) jumlah_konfirm
            from trx_akses_menu_ck
            where userid_ck = $1 
            and tgl_akses is not null) jumlah_konfirm,
            count(case when userid_ck = $1 then 1 else 0 end) jumlah_menu
            from trx_akses_menu_ck
        where userid_ck = $1 )
        select jumlah_konfirm progress,case when jumlah_konfirm=0 then 0 else (jumlah_konfirm/jumlah_menu)*100 end as persen_progress 
        from x`;

      await pool.db_HCM
        .query(query, [employee_id])
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: rows[0],
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
