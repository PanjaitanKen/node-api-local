const pool = require('../../db');

// Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
const controller = {
  async updateHPNoCK(request, response) {
    try {
      const { useridCK, phone_number } = request.body;

      await pool.db_MMFPROD
        .query(
          `select Count(*) ada_hp from applicant_contact_info_tbl
        where contact_type ='3' and default_address ='Y' and applicant_id = $1`,
          [useridCK]
        )
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows[0].ada_hp != 0) {
            await pool.db_MMFPROD
              .query(
                `update applicant_contact_info_tbl set contact_value =$2
              where contact_type ='3' and default_address ='Y' and applicant_id = $1`,
                [useridCK, phone_number]
              )
              .then(async ({ rowCount }) => {
                // eslint-disable-next-line eqeqeq
                if (rowCount != 0) {
                  await pool.db_MMFPROD
                    .query(
                      `update person_contact_method_tbl set contact_value =$2
                    where contact_type ='3' and default_address ='Y' 
                    and person_id = (select person_id from candidate_appointment_tbl where candidate_id = $1)`,
                      [useridCK, phone_number]
                    )
                    .then(async ({ rowCount }) => {
                      // eslint-disable-next-line eqeqeq
                      if (results.rowCount != 0) {
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
