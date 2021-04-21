/* eslint-disable no-restricted-syntax */
const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  storeEmployeeId(request, response) {
    try {
      const { employee_id } = request.body;
      let employee_code_store = [];
      let employee_code_store2 = [];
      // eslint-disable-next-line no-inner-declarations
      function arr_diff(a1, a2) {
        // eslint-disable-next-line prefer-const
        let a = [];
        // eslint-disable-next-line prefer-const
        let diff = [];

        // eslint-disable-next-line no-var
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < a1.length; i++) {
          a[a1[i]] = true;
        }

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < a2.length; i++) {
          if (a[a2[i]]) {
            delete a[a2[i]];
          } else {
            a[a2[i]] = true;
          }
        }

        // eslint-disable-next-line no-restricted-syntax
        // eslint-disable-next-line guard-for-in
        for (const k in a) {
          diff.push(k);
        }

        return diff;
      }

      pool.db_HCM.query(
        'select employee_code from mas_karyawan_uat',
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            employee_code_store = results.rows.map(function (a) {
              const bb = a.employee_code;
              return bb;
            });

            const employee_id_diff = arr_diff(employee_code_store, employee_id);
            employee_code_store2 = employee_id_diff.map(function (a) {
              const employee_code_insert = a;
              pool.db_HCM.query(
                `insert into mas_karyawan_uat (employee_code )
                values ($1) ON CONFLICT (employee_code) DO NOTHING`,
                [employee_code_insert],
                (error, results) => {
                  if (error) throw error;
                }
              );
              return {
                employee_code_insert: a,
              };
            });
            response.status(201).send({
              status: 201,
              message: 'Insert Data succes',
              data: '',
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              data: '',
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
