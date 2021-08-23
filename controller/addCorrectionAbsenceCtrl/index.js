const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : person_tbl, employee_tbl
const controller = {
  async addCorrectionAbsence(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, data_perbaikan, data_original } = request.body;

    console.log(data_perbaikan, 'data perbaikan');
    console.log(data_original, 'data original');
    Helpers.logger(
      'SUCCESS',
      { employee_id },
      'addCorrectionAbsenceCtrl.addCorrectionAbsence'
    );

    try {
      const query = `select a.employee_id, b.display_name ,current_Date as request_date,
      c.supervisor_id as approved_by,e.display_name as approved_name,h.schedule_type ,i.day_type,
      j.time_in as default_time_in,j.time_out as default_time_out,
      f.contact_value as no_hp_supervisor, g.contact_value as email_supervisor
      from employee_tbl a
      left join person_tbl b on a.person_id = b.person_id 
      left join employee_supervisor_tbl c on a.employee_id = c.employee_id and current_Date between c.valid_from  and c.valid_to 
      left join employee_tbl d on c.supervisor_id =d.employee_id 
      left join person_tbl e on d.person_id =e.person_id 
      left join person_contact_method_tbl f on e.person_id = f.person_id and f.default_address ='Y' and f.contact_type ='3'
      left join person_contact_method_tbl g on e.person_id = g.person_id and g.default_address ='Y' and g.contact_type ='4'
      left join emp_work_schedule_tbl h on a.employee_id = h.employee_id  and current_date between h.valid_from and h.valid_to 
      left join work_schedule_cycle_tbl i on h.schedule_type = i.schedule_type and i.day_sequence='1'
      left join day_type_tbl j on i.day_type = j.day_type 
      where a.employee_id = $1`;

      await pool.db_MMFPROD
        .query(query, [employee_id])
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            const data_display_name = rows[0].display_name;
            const data_approved_by = rows[0].approved_by;
            const data_approved_name = rows[0].approved_name;
            const data_schedule_type = rows[0].schedule_type;
            const data_day_to = rows[0].day_to;
            const data_day_type = rows[0].day_type;
            const data_default_time_in = rows[0].default_time_in;
            const data_default_time_out = rows[0].default_time_out;
            const data_no_hp_supervisor = rows[0].no_hp_supervisor;
            const data_email_supervisor = rows[0].email_supervisor;

            pool.db_MMFPROD.query(
              `insert into correction_absence_hcm_h (employee_id,display_name,request_date,note,approved_by, approved_name,
                state_approval, approval_Date)
                values ($1, $2, current_Date , ' Perbaikan Absen Pengajuan Tanggal '||to_char(current_date,'YYYY-MM-DD') , $3, $4,
                'Submitted', null)`,
              [
                employee_id,
                data_display_name,
                data_approved_by,
                data_approved_name,
              ],
              (error, results) => {
                if (error) {
                  throw error;
                }
                // eslint-disable-next-line eqeqeq
                if (results.rowCount != 0) {
                  // eslint-disable-next-line no-plusplus
                  for (let i = 0; i < data_perbaikan.length; i++) {
                    let counter = i + 1;
                    let data_register_time_in =
                      data_original[i].time_in == null
                        ? null
                        : data_perbaikan[i].date +
                          ' ' +
                          data_original[i].time_in +
                          ':' +
                          '00';
                    let data_register_time_out =
                      data_original[i].time_out == null
                        ? null
                        : data_perbaikan[i].date +
                          ' ' +
                          data_original[i].time_out +
                          ':' +
                          '00';
                    let data_correction_time_in =
                      data_perbaikan[i].time_in == null
                        ? null
                        : data_perbaikan[i].date +
                          ' ' +
                          data_perbaikan[i].time_in +
                          ':' +
                          '00';
                    let data_correction_time_out =
                      data_perbaikan[i].time_out == null
                        ? null
                        : data_perbaikan[i].date +
                          ' ' +
                          data_perbaikan[i].time_out +
                          ':' +
                          '00';
                    console.log(counter, 'counter');
                    console.log(data_register_time_in, 'data_register_time_in');
                    console.log(
                      data_register_time_out,
                      'data_register_time_out'
                    );
                    console.log(
                      data_correction_time_in,
                      'data_correction_time_in'
                    );
                    console.log(
                      data_correction_time_out,
                      'data_correction_time_out'
                    );
                    pool.db_MMFPROD.query(
                      `insert into correction_absence_hcm_d (cor_absence_id,cor_id_detail, clocking_date,schedule_type,days_to,
                      day_type,default_time_in,default_time_out,
                      register_time_in,register_time_out,correction_time_in,correction_time_out,note,state)
                      values ((currval('cor_absence_hcm_id_seq')), $11, $1, $2 , $3, $4 , $5, $6, $7, $8, $9, $10,
                      'Perbaikan Absen Tanggal Absen '||'2021-08-19' ,'Submitted')`,
                      [
                        data_perbaikan[i].date,
                        data_schedule_type,
                        data_day_to,
                        data_day_type,
                        data_default_time_in,
                        data_default_time_out,
                        data_register_time_in,
                        data_register_time_out,
                        data_correction_time_in,
                        data_correction_time_out,
                        counter,
                      ],
                      (error, results) => {
                        if (error) {
                          throw error;
                        }
                      }
                    );
                  }
                  console.log(results.rowCount, 'tessssssssssssssssssssss');
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
            'addCorrectionAbsenceCtrl.addCorrectionAbsence',
            error
          );
          throw error;
        });
    } catch (err) {
      Helpers.logger(
        'ERROR',
        { employee_id },
        'addCorrectionAbsenceCtrl.addCorrectionAbsence',
        err
      );
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
