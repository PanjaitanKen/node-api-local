const dateFormat = require('dateformat');
const pool = require('../../db');

// Tabel : trx_log_user
const controller = {
  addLogUser(request, response) {
    try {
      const { employee_code, employee_id, menu } = request.body;
      const date = dateFormat(new Date(), 'yyyy-mm-dd');

      if ((employee_code || employee_id) && menu) {
        pool.db_HCM.query(
          `select count(*) cek  from trx_log_user 
          where employee_code=$1 and to_char(tanggal,'YYYY-MM-DD')=$2 
          and menu=$3
            `,
          [employee_code || employee_id, date, menu],
          (error, results) => {
            if (error) throw error;

            // eslint-disable-next-line eqeqeq
            if (results.rows != '') {
              // eslint-disable-next-line eqeqeq
              if (results.rows[0].cek != 0) {
                response.status(200).send({
                  status: 200,
                  message: 'Load Data berhasil',
                  validate_id: employee_code || employee_id,
                  data: results.rows[0],
                });
              } else {
                pool.db_HCM.query(
                  'insert into trx_log_user (employee_code ,tanggal ,menu) values ($1,current_timestamp,$2)',
                  [employee_code || employee_id, menu],
                  (error) => {
                    if (error) throw error;

                    // eslint-disable-next-line eqeqeq
                    response.status(201).send({
                      status: 201,
                      message: 'Insert Data berhasil',
                      data: '',
                    });
                  }
                );
              }
            } else {
              response.status(200).send({
                status: 200,
                message: 'Data Tidak Ditemukan',
                validate_id: employee_code || employee_id,
                data: results.rows,
              });
            }
          }
        );
      } else {
        // eslint-disable-next-line no-console
        console.error('((employee_code OR employee_id) AND menu) REQUIRED!');

        response.status(422).send({
          status: 422,
          message: '((employee_code OR employee_id) AND menu) REQUIRED!',
          data: '',
        });
      }
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
