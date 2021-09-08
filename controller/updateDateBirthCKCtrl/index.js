const pool = require('../../db');

// Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
const controller = {
  async updateDateBirthCK(request, response) {
    try {
      const { useridCK, date_birth } = request.body;

      await pool.db_MMFPROD
        .query(
          `select Count(*) ada_data from applicant_tbl
        where applicant_id = $1`,
          [useridCK]
        )
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows[0].ada_data != 0) {
            await pool.db_MMFPROD
              .query(
                `update applicant_tbl set date_of_birth =$2
              where applicant_id = $1`,
                [useridCK, date_birth]
              )
              .then(async ({ rowCount }) => {
                // eslint-disable-next-line eqeqeq
                if (rowCount != 0) {
                  await pool.db_MMFPROD
                    .query(
                      ` update person_tbl set birth_date =$2
                    where person_id = (select person_id from candidate_appointment_tbl where candidate_id = $1)`,
                      [useridCK, date_birth]
                    )
                    .then(async ({ rowCount }) => {
                      // eslint-disable-next-line eqeqeq
                      if (rowCount != 0) {
                        response.status(201).send({
                          status: 202,
                          message: 'update Success',
                          validate_id: useridCK,
                          data: '',
                        });
                      } else {
                        response.status(201).send({
                          status: 202,
                          message: 'update failed 1',
                          validate_id: useridCK,
                          data: '',
                        });
                      }
                    })
                    .catch((error) => {
                      throw error;
                    });
                } else {
                  response.status(201).send({
                    status: 200,
                    message: 'Update Failed 2',
                    validate_id: useridCK,
                    data: '',
                  });
                }
              })
              .catch((error) => {
                throw error;
              });
          } else {
            response.status(201).send({
              status: 200,
              message: 'Update Failed 3',
              validate_id: useridCK,
              data: '',
            });
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      response.status(500).send(error);
    }
  },
};

module.exports = controller;
