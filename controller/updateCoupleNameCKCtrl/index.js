const pool = require('../../db');

// Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
const controller = {
  updateCoupleNameCK(request, response) {
    try {
      const { useridCK, upd_couple_name } = request.body;

      pool.db_MMFPROD.query(
        `select count(*) ada_pasangan 
        from applicant_family_tbl aft  where applicant_id = $1
        and gender ='1' and relationship_type ='1'`,
        [useridCK],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows[0].ada_pasangan != 0) {
            pool.db_MMFPROD.query(
              `update applicant_family_tbl set name =$2
              where relationship_type ='1' and applicant_id = $1`,
              [useridCK, upd_couple_name],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rowCount != 0) {
                  pool.db_MMFPROD.query(
                    `update person_family_tbl set name = $2
                    where relationship_type ='1' 
                    and person_id = (select person_id from candidate_appointment_tbl where candidate_id = $1)`,
                    [useridCK, upd_couple_name],
                    (error, results) => {
                      if (error) throw error;

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
                    }
                  );
                } else {
                  response.status(201).send({
                    status: 200,
                    message: 'Update Failed 2',
                    validate_id: useridCK,
                    data: '',
                  });
                }
              }
            );
          } else {
            response.status(201).send({
              status: 200,
              message: 'Update Failed 3',
              validate_id: useridCK,
              data: '',
            });
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
};

module.exports = controller;
