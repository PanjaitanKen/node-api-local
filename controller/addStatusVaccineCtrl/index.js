const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  addStatusVaccine(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      employee_id,
      emp_vaccine_status,
      emp_jumlah_anggota,
      emp_jumlah_anggota_vaccine,
    } = request.body;

    Helpers.logger(
      'SUCCESS',
      {
        employee_id,
        emp_vaccine_status,
        emp_jumlah_anggota,
        emp_jumlah_anggota_vaccine,
      },
      'addStatusVaccineCtrl.addStatusVaccine'
    );

    try {
      pool.db_HCM.query(
        `select count(*)  as input_status_vaksin from mas_data_vaksin 
        where employee_id= $1`,
        [employee_id],
        (error, results) => {
          if (error) {
            Helpers.logger(
              'ERROR',
              {
                employee_id,
                emp_vaccine_status,
                emp_jumlah_anggota,
                emp_jumlah_anggota_vaccine,
              },
              'addStatusVaccineCtrl.addStatusVaccine',
              error
            );

            throw error;
          }

          // eslint-disable-next-line eqeqeq
          if (results.rows != 0) {
            // eslint-disable-next-line eqeqeq
            if (results.rows[0].input_status_vaksin != 0) {
              pool.db_MMFPROD.query(
                `select a.employee_id ,b.display_name, d.pcx_kd_cabang,d.company_office,
              d.pcx_wilayah, d.pcx_regional, e.jumlah_anggota_tercatat
              from  employee_tbl a
              left join person_tbl b on a.person_id = b.person_id
              left join emp_company_office_tbl c on a.employee_id=c.employee_id and current_date between valid_from and valid_to
              left join company_office_tbl d on c.company_office = d.company_office 
              left join (
                    select employee_id, count(*) jumlah_anggota_tercatat from  person_tbl a
                    left join employee_tbl b on a.person_id = b.person_id 
                    left join person_family_tbl c on a.person_id =c.person_id 
                    where b.employee_id = $1
                    group by employee_id
              ) e on a.employee_id = e.employee_id
              where a.employee_id =  $1`,
                [employee_id],
                (error, results) => {
                  if (error) {
                    Helpers.logger(
                      'ERROR',
                      {
                        employee_id,
                        emp_vaccine_status,
                        emp_jumlah_anggota,
                        emp_jumlah_anggota_vaccine,
                      },
                      'addStatusVaccineCtrl.addStatusVaccine',
                      error
                    );

                    throw error;
                  }

                  // eslint-disable-next-line eqeqeq
                  if (results.rows != 0) {
                    const data_display_name = results.rows[0].display_name;
                    const data_pcx_kd_cabang = results.rows[0].pcx_kd_cabang;
                    const data_company_office = results.rows[0].company_office;
                    const data_pcx_wilayah = results.rows[0].pcx_wilayah;
                    const data_pcx_regional = results.rows[0].pcx_regional;
                    const data_jumlah_anggota_tercatat =
                      results.rows[0].jumlah_anggota_tercatat;
                    pool.db_HCM.query(
                      `update mas_data_vaksin
                      set 
                      display_name = $2,
                      pcx_kd_cabang = $3,
                      company_office = $4,
                      pcx_wilayah = $5,
                      pcx_regional= $6,
                      sudah_vaksin = $7,
                      jumlah_anggota_keluarga = $8,
                      jumlah_vaksin_anggota = $9,
                      jumlah_anggota_tercatat = $10,
                      tgl_update = current_date
                      where employee_id = $1`,
                      [
                        employee_id,
                        data_display_name,
                        data_pcx_kd_cabang,
                        data_company_office,
                        data_pcx_wilayah,
                        data_pcx_regional,
                        emp_vaccine_status,
                        emp_jumlah_anggota,
                        emp_jumlah_anggota_vaccine,
                        data_jumlah_anggota_tercatat,
                      ],
                      (error, results) => {
                        if (error) {
                          Helpers.logger(
                            'ERROR',
                            {
                              employee_id,
                              emp_vaccine_status,
                              emp_jumlah_anggota,
                              emp_jumlah_anggota_vaccine,
                            },
                            'addStatusVaccineCtrl.addStatusVaccine',
                            error
                          );

                          throw error;
                        }

                        // eslint-disable-next-line eqeqeq
                        // eslint-disable-next-line eqeqeq
                        if (results.rowCount != 0) {
                          response.status(200).send({
                            status: 202,
                            message: 'Update Data Success',
                            validate_id: employee_id,
                            data: '',
                          });
                        } else {
                          response.status(200).send({
                            status: 200,
                            message: 'Data already Exist',
                            validate_id: employee_id,
                            data: '',
                          });
                        }
                      }
                    );
                  } else {
                    response.status(200).send({
                      status: 200,
                      message: 'Data Not Found',
                      validate_id: employee_id,
                      data: '',
                    });
                  }
                }
              );
            } else {
              pool.db_MMFPROD.query(
                `select a.employee_id ,b.display_name, d.pcx_kd_cabang,d.company_office,
              d.pcx_wilayah, d.pcx_regional, e.jumlah_anggota_tercatat
              from  employee_tbl a
              left join person_tbl b on a.person_id = b.person_id
              left join emp_company_office_tbl c on a.employee_id=c.employee_id and current_date between valid_from and valid_to
              left join company_office_tbl d on c.company_office = d.company_office 
              left join (
                    select employee_id, count(*) jumlah_anggota_tercatat from  person_tbl a
                    left join employee_tbl b on a.person_id = b.person_id 
                    left join person_family_tbl c on a.person_id =c.person_id 
                    where b.employee_id = $1
                    group by employee_id
              ) e on a.employee_id = e.employee_id
              where a.employee_id =  $1`,
                [employee_id],
                (error, results) => {
                  if (error) {
                    Helpers.logger(
                      'ERROR',
                      {
                        employee_id,
                        emp_vaccine_status,
                        emp_jumlah_anggota,
                        emp_jumlah_anggota_vaccine,
                      },
                      'addStatusVaccineCtrl.addStatusVaccine',
                      error
                    );

                    throw error;
                  }

                  // eslint-disable-next-line eqeqeq
                  if (results.rows != 0) {
                    const data_display_name = results.rows[0].display_name;
                    const data_pcx_kd_cabang = results.rows[0].pcx_kd_cabang;
                    const data_company_office = results.rows[0].company_office;
                    const data_pcx_wilayah = results.rows[0].pcx_wilayah;
                    const data_pcx_regional = results.rows[0].pcx_regional;
                    const data_jumlah_anggota_tercatat =
                      results.rows[0].jumlah_anggota_tercatat;
                    pool.db_HCM.query(
                      `insert into mas_data_vaksin (tgl_input,employee_id,display_name,pcx_kd_cabang,company_office,
                        pcx_wilayah,pcx_regional,sudah_vaksin,jumlah_anggota_keluarga,jumlah_vaksin_anggota,jumlah_anggota_tercatat,
                        tgl_update) values (current_date, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, current_date)`,
                      [
                        employee_id,
                        data_display_name,
                        data_pcx_kd_cabang,
                        data_company_office,
                        data_pcx_wilayah,
                        data_pcx_regional,
                        emp_vaccine_status,
                        emp_jumlah_anggota,
                        emp_jumlah_anggota_vaccine,
                        data_jumlah_anggota_tercatat,
                      ],
                      (error, results) => {
                        if (error) {
                          Helpers.logger(
                            'ERROR',
                            {
                              employee_id,
                              emp_vaccine_status,
                              emp_jumlah_anggota,
                              emp_jumlah_anggota_vaccine,
                            },
                            'addStatusVaccineCtrl.addStatusVaccine',
                            error
                          );

                          throw error;
                        }

                        // eslint-disable-next-line eqeqeq
                        // eslint-disable-next-line eqeqeq
                        if (results.rowCount != 0) {
                          response.status(200).send({
                            status: 201,
                            message: 'Insert Data Success',
                            validate_id: employee_id,
                            data: '',
                          });
                        } else {
                          response.status(200).send({
                            status: 200,
                            message: 'Data already Exist',
                            validate_id: employee_id,
                            data: '',
                          });
                        }
                      }
                    );
                  } else {
                    response.status(200).send({
                      status: 200,
                      message: 'Data Not Found',
                      validate_id: employee_id,
                      data: '',
                    });
                  }
                }
              );
            }
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Not Found',
              validate_id: employee_id,
              data: '',
            });
          }
        }
      );
    } catch (err) {
      Helpers.logger(
        'ERROR',
        {
          employee_id,
          emp_vaccine_status,
          emp_jumlah_anggota,
          emp_jumlah_anggota_vaccine,
        },
        'addStatusVaccineCtrl.addStatusVaccine',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
