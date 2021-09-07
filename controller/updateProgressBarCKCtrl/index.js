const { validationResult } = require('express-validator');
const axios = require('axios');
const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  async updateProgressBarCK(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    try {
      const { employee_id, id_menu_ck } = request.body;

      // insert log activity user -- start
      const data = {
        employee_id,
        menu: 'Menu CK',
      };

      const options = {
        headers: {
          'Content-Type': 'application/json',
          API_KEY: process.env.API_KEY,
        },
      };

      axios
        .post(`${process.env.URL}/hcm/api/addLogUser`, data, options)
        .then((res) => {
          console.log('RESPONSE ==== : ', res.data);
        })
        .catch((err) => {
          console.log('ERROR: ====', err);
          throw err;
        });
      // insert log activity user -- end

      const query = `select count(*) sudah_akses from trx_akses_menu_ck
        where userid_ck = $1 and id_menu_ck =$2
        and tgl_akses is not null`;
      await pool.db_HCM
        .query(query, [employee_id, id_menu_ck])
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            if (rows[0].sudah_akses >= 1) {
              response.status(200).send({
                status: 200,
                message: 'Load Data berhasil',
                validate_id: employee_id,
                data: rows[0],
              });
            } else {
              await pool.db_HCM
                .query(
                  `update trx_akses_menu_ck set tgl_akses =current_date
                where userid_ck = $1 and id_menu_ck =$2`,
                  [employee_id, id_menu_ck]
                )
                .then(async () => {
                  // eslint-disable-next-line eqeqeq
                  response.status(202).send({
                    status: 'SUCCESS',
                    message: 'UPDATE USER',
                    validate_id: employee_id,
                    data: '',
                  });
                });
            }
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
