const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  getDescAbsence(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, date_in_timestamp } = request.body;

    Helpers.logger(
      'SUCCESS',
      {
        employee_id,
        date_in_timestamp,
      },
      'getDescAbsenceCtrl.getDescAbsence'
    );

    try {
      pool.db_MMFPROD.query(
        ` select a.employee_id, $2 as tanggal, a.schedule_type,
        extract(isodow from $2::timestamp) as  hari_ke, b.day_type, 
        c.time_in as default_time_in,c.time_out as default_time_out, 
        --to_char(c.time_in,'HH24:MI') as jam_masuk_default,
        --to_char(c.time_out,'HH24:MI') as jam_pulang_DefaulT,
        D.time_IN as register_time_in, d.time_out as register_time_out,
        --to_char(D.time_IN,'HH24:MI') as jam_masuk_terdaftar, 
        --to_char(D.time_out,'HH24:MI') as jam_keluar_terdaftar,
        e.supervisor_id, g.display_name ,h.position_id, i.contact_value as hp_approver, j.contact_value as email_approver
        from emp_work_schedule_tbl a
        left join work_schedule_cycle_tbl b on b.schedule_type = a.schedule_type 
                               and b.day_sequence=extract(isodow from $2::timestamp)
        left join day_type_tbl c on b.day_type = c.day_type 
        left join emp_clocking_detail_tbl d on a.employee_id = d.employee_id and d.clocking_date = $2
        left join employee_supervisor_tbl e on a.employee_id = e.employee_id 
            and current_Date between e.valid_from and e.valid_to
        left join employee_tbl f on e.supervisor_id = f.employee_id     
        left join person_tbl g on f.person_id =g.person_id 
        left join employee_position_tbl h on e.supervisor_id = h.employee_id 
                 and current_Date between h.valid_from and h.valid_to  
                 
        left join person_contact_method_tbl i on g.person_id = i.person_id and i.default_address ='Y' and i.contact_type='3' 
        left join person_contact_method_tbl j on g.person_id = j.person_id and j.default_address ='Y' and j.contact_type='4'        
        where a.employee_id = $1
        and $2 between a.valid_from and a.valid_to`,
        [employee_id, date_in_timestamp],
        (error, results) => {
          if (error) {
            Helpers.logger(
              'ERROR',
              {
                employee_id,
                date_in_timestamp,
              },
              'getDescAbsenceCtrl.getDescAbsence',
              error
            );

            throw error;
          }

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: results.rows,
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: employee_id,
              data: results.rows,
            });
          }
        }
      );
    } catch (err) {
      Helpers.logger(
        'ERROR',
        {
          employee_id,
          date_in_timestamp,
        },
        'getDescAbsenceCtrl.getDescAbsence',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
