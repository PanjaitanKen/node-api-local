const _ = require('lodash');
const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : mark_location_tbl, emp_work_schedule_tbl, emp_work_location_tbl
const controller = {
  async getLongitude_Branch(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id } = request.body;

    Helpers.logger(
      'SUCCESS',
      { employee_id },
      'getLongitudeBranchCtrl.getLongitude_Branch'
    );

    try {
      let radius_tolerance = 0;

      const query = 'select * from param_hcm ';
      await pool.db_HCM
        .query(query)
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            // map hostmail
            const hcm_param_radius_tolerance = _.filter(
              rows,
              // eslint-disable-next-line eqeqeq
              (o) => o.setting_name == 'RADIUS_TOLERANCE'
            );
            radius_tolerance = hcm_param_radius_tolerance[0].setting_value;
            await pool.db_MMFPROD
              .query(
                "select count(*) from emp_work_schedule_tbl a left join emp_work_location_tbl b on a.employee_id =b.employee_id and current_date between b.valid_from and b.valid_to  where clocking_all ='Y' and current_date between a.valid_from and a.valid_to and a.employee_id= $1 ",
                [employee_id]
              )
              .then(async ({ rows }) => {
                // eslint-disable-next-line eqeqeq
                if (rows[0].count == 1) {
                  await pool.db_MMFPROD
                    .query(
                      'select location_name,location_no, latitude,altitude, longitude, accuracy, COALESCE(radius_tolerance + $1) as radius_tolerance from mark_location_tbl order by location_no asc',
                      [radius_tolerance]
                    )
                    .then(async ({ rows }) => {
                      // eslint-disable-next-line eqeqeq
                      if (rows != '') {
                        response.status(200).send({
                          status: 200,
                          message: 'Load Data berhasil',
                          validate_id: employee_id,
                          data: rows,
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
                      Helpers.logger(
                        'ERROR',
                        { employee_id },
                        'getLongitudeBranchCtrl.getLongitude_Branch',
                        error
                      );

                      throw error;
                    });
                } else {
                  await pool.db_MMFPROD
                    .query(
                      "select case when work_location='JAKARTA' then 'PUSAT' when work_location='MAKASSAR' then 'MAKASSAR 2' else work_location end as work_location, b.company_office " +
                        ' from emp_work_location_tbl a ' +
                        ' left join emp_company_office_tbl b on a.employee_id = b.employee_id  and current_date between b.valid_from and b.valid_to ' +
                        ' where a.employee_id= $1 and  current_date between a.valid_from and a.valid_to ',
                      [employee_id]
                    )
                    .then(async ({ rows }) => {
                      // eslint-disable-next-line eqeqeq
                      if (rows != '') {
                        const location_name = rows[0].work_location;
                        // eslint-disable-next-line prefer-destructuring
                        const company_office = rows[0].company_office;
                        await pool.db_MMFPROD
                          .query(
                            'select location_name,location_no, latitude,altitude, longitude, accuracy, COALESCE(radius_tolerance + $3) as radius_tolerance from mark_location_tbl where  trim(location_name)= $1 or trim(company_office) = $2 order by location_no asc',
                            [location_name, company_office, radius_tolerance]
                          )
                          .then(async ({ rows }) => {
                            response.status(200).send({
                              status: 200,
                              message: 'Load Data berhasil',
                              validate_id: employee_id,
                              data: rows,
                            });
                          })
                          .catch((error) => {
                            Helpers.logger(
                              'ERROR',
                              { employee_id },
                              'getLongitudeBranchCtrl.getLongitude_Branch',
                              error
                            );

                            throw error;
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
                      Helpers.logger(
                        'ERROR',
                        { employee_id },
                        'getLongitudeBranchCtrl.getLongitude_Branch',
                        error
                      );

                      throw error;
                    });
                }
              });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              data: rows,
            });
          }
        })
        .catch((error) => {
          Helpers.logger(
            'ERROR',
            { employee_id },
            'getLongitudeBranchCtrl.getLongitude_Branch',
            error
          );

          throw error;
        });
    } catch (err) {
      Helpers.logger(
        'ERROR',
        { employee_id },
        'getLongitudeBranchCtrl.getLongitude_Branch',
        err
      );

      response.status(500).send(err);
    }
  },
  async checkHealth(request, response) {
    try {
      const { rows } = await pool.db_MMFPROD.query(
        "select count(company_office) from company_office_tbl where company_office in ('PUSAT', 'MAKASSAR')"
      );

      response.status(200).json({
        message: 'GOOD',
        data: rows[0],
      });
    } catch (error) {
      response.status(500).json({
        message: 'BAD',
        data: error,
      });
    }
  },
};

module.exports = controller;
