const pool = require('../../db');

// Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
const controller = {
  async updateNameCK(request, response) {
    try {
      const { useridCK, upd_ck_first_name, upd_ck_last_name } = request.body;

      await pool.db_MMFPROD
        .query(
          `select count(*) ada_karyawan 
        from applicant_tbl aft  where applicant_id = $1`,
          [useridCK]
        )
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows[0].ada_karyawan != 0) {
            await pool.db_MMFPROD
              .query(
                `update applicant_tbl  set first_name = $2, last_name = $3
              where applicant_id = $1`,
                [useridCK, upd_ck_first_name, upd_ck_last_name]
              )
              .then(async ({ rowCount }) => {
                // eslint-disable-next-line eqeqeq
                if (rowCount != 0) {
                  await pool.db_MMFPROD
                    .query(
                      `update person_tbl  set 
                    display_name = coalesce(trim($2),' ')||' '||coalesce(trim($3),' ') , first_name = coalesce($2,' '), 
                    last_name = coalesce($3,' ')
                    where person_id = (select person_id from candidate_appointment_tbl where candidate_id = $1)`,
                      [useridCK, upd_ck_first_name, upd_ck_last_name]
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
