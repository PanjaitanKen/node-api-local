const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  async getStatusVaccine(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id } = request.body;

    Helpers.logger(
      'SUCCESS',
      {
        employee_id,
      },
      'getStatusVaccineCtrl.getStatusVaccine'
    );

    try {
      const query = `select sudah_vaksin, jumlah_anggota_keluarga, jumlah_vaksin_anggota
        from mas_data_vaksin
        where  employee_id= $1`;
      await pool.db_HCM
        .query(query, [employee_id])
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != 0) {
            response.status(200).send({
              status: 200,
              message: 'Load Data Success',
              validate_id: employee_id,
              data: rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Not Found',
              validate_id: employee_id,
              data: '',
            });
          }
        })
        .catch((error) => {
          Helpers.logger(
            'ERROR',
            {
              employee_id,
            },
            'getStatusVaccineCtrl.getStatusVaccine',
            error
          );
          throw error;
        });
    } catch (err) {
      Helpers.logger(
        'ERROR',
        {
          employee_id,
        },
        'getStatusVaccineCtrl.getStatusVaccine',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
