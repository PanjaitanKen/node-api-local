/* eslint-disable eqeqeq */
const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  async addStatusVaccine(request, response) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json(Helpers.dataResponse(422, errors));
    }

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
      await pool.db_HCM
        .query(
          'select count(*) as input_status_vaksin from mas_data_vaksin where employee_id = $1',
          [employee_id]
        )
        .then(async ({ rows }) => {
          if (rows[0].input_status_vaksin != 0) {
            await pool.db_MMFPROD
              .query(
                `select a.employee_id ,b.display_name, d.pcx_kd_cabang,d.company_office,
              d.pcx_wilayah, d.pcx_regional, e.jumlah_anggota_tercatat, g.internal_title as nama_posisi
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
              left join employee_position_tbl f on a.employee_id = f.employee_id and current_Date between f.valid_from and f.valid_to
              left join position_tbl g on f.position_id =g.position_id 
              where a.employee_id =  $1`,
                [employee_id]
              )
              .then(async ({ rows, rowCount }) => {
                if (rowCount) {
                  const {
                    display_name: data_display_name,
                    pcx_kd_cabang: data_pcx_kd_cabang,
                    company_office: data_company_office,
                    pcx_wilayah: data_pcx_wilayah,
                    pcx_regional: data_pcx_regional,
                    jumlah_anggota_tercatat: data_jumlah_anggota_tercatat,
                    nama_posisi,
                  } = rows[0];

                  await pool.db_HCM
                    .query(
                      `update mas_data_vaksin
                      set 
                      display_name = $2,
                      nama_posisi = $3,
                      pcx_kd_cabang = $4,
                      company_office = $5,
                      pcx_wilayah = $6,
                      pcx_regional= $7,
                      sudah_vaksin = $8,
                      jumlah_anggota_keluarga = $9,
                      jumlah_vaksin_anggota = $10,
                      jumlah_anggota_tercatat = $11,
                      tgl_update = current_date
                      where employee_id = $1`,
                      [
                        employee_id,
                        data_display_name,
                        nama_posisi,
                        data_pcx_kd_cabang,
                        data_company_office,
                        data_pcx_wilayah,
                        data_pcx_regional,
                        emp_vaccine_status,
                        emp_jumlah_anggota,
                        emp_jumlah_anggota_vaccine,
                        data_jumlah_anggota_tercatat,
                      ]
                    )
                    .then(() => {
                      response
                        .status(201)
                        .json(
                          Helpers.dataResponse(201, 'UPDATED', employee_id)
                        );
                    })
                    .catch((error) => {
                      throw error;
                    });
                } else {
                  response
                    .status(404)
                    .json(
                      Helpers.dataResponse(404, 'employee_id', employee_id)
                    );
                }
              })
              .catch((error) => {
                throw error;
              });
          } else {
            await pool.db_MMFPROD
              .query(
                `select a.employee_id ,b.display_name, d.pcx_kd_cabang,d.company_office,
              d.pcx_wilayah, d.pcx_regional, e.jumlah_anggota_tercatat,g.internal_title as nama_posisi
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
              left join employee_position_tbl f on a.employee_id = f.employee_id and current_Date between f.valid_from and f.valid_to
              left join position_tbl g on f.position_id =g.position_id 
              where a.employee_id =  $1`,
                [employee_id]
              )
              .then(async ({ rows, rowCount }) => {
                if (rowCount) {
                  const {
                    display_name: data_display_name,
                    pcx_kd_cabang: data_pcx_kd_cabang,
                    company_office: data_company_office,
                    pcx_wilayah: data_pcx_wilayah,
                    pcx_regional: data_pcx_regional,
                    jumlah_anggota_tercatat: data_jumlah_anggota_tercatat,
                    nama_posisi,
                  } = rows[0];

                  await pool.db_HCM
                    .query(
                      `insert into mas_data_vaksin (tgl_input,employee_id,display_name,nama_posisi,pcx_kd_cabang,company_office,
                        pcx_wilayah,pcx_regional,sudah_vaksin,jumlah_anggota_keluarga,jumlah_vaksin_anggota,jumlah_anggota_tercatat,
                        tgl_update) values (current_date, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, current_date)`,
                      [
                        employee_id,
                        data_display_name,
                        nama_posisi,
                        data_pcx_kd_cabang,
                        data_company_office,
                        data_pcx_wilayah,
                        data_pcx_regional,
                        emp_vaccine_status,
                        emp_jumlah_anggota,
                        emp_jumlah_anggota_vaccine,
                        data_jumlah_anggota_tercatat,
                      ]
                    )
                    .then(() => {
                      response
                        .status(201)
                        .json(
                          Helpers.dataResponse(201, 'CREATED', employee_id)
                        );
                    })
                    .catch((error) => {
                      throw error;
                    });
                } else {
                  response
                    .status(404)
                    .json(
                      Helpers.dataResponse(404, 'employee_id', employee_id)
                    );
                }
              })
              .catch((error) => {
                throw error;
              });
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      Helpers.logger(
        'ERROR',
        {
          employee_id,
          emp_vaccine_status,
          emp_jumlah_anggota,
          emp_jumlah_anggota_vaccine,
        },
        'addStatusVaccineCtrl.addStatusVaccine',
        error.message
      );

      response.status(500).json(Helpers.dataResponse(500, []));
    }
  },
};

module.exports = controller;
