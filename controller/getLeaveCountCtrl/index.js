const pool = require('../../db');
const { validationResult } = require('express-validator');
const axios = require('axios');

// Tabel : emp_work_schedule_tbl
const controller = {
  getLeave_Count(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    try {
      const { employee_id, leave_date_from, leave_date_to } = request.body;

      //insert log activity user -- start
      const data = {
        employee_id: employee_id,
        menu: 'Cuti',
      };

      const options = {
        headers: {
          'Content-Type': 'application/json',
          API_KEY: process.env.API_KEY,
        },
      };

      axios
        .post(process.env.url + '/hcm/api/addLogUser', data, options)
        .then((res) => {
          console.log('RESPONSE ==== : ', res.data);
        })
        .catch((err) => {
          console.log('ERROR: ====', err);
        });
      //insert log activity user -- end

      pool.db_MMFPROD.query(
        `select count(*) jumlah_cuti_diambil from (
          SELECT date_trunc('day', dates_generate):: date dates_generate
          FROM generate_series ( to_date($2,'YYYY-MM-DD') , to_date($3,'YYYY-MM-DD') , '1 day'::interval) dates_generate 
          ) a 
          where to_char(dates_generate,'YYYY-MM-DD') between $2 and $3
          and date_part('isodow',dates_generate) not in  
          (select b.day_sequence from emp_work_schedule_tbl a 
          left join work_schedule_cycle_tbl b on a.schedule_type =b.schedule_type  
          where current_date between valid_from and valid_to and a.employee_id = $1 and b.day_type ='OFFHOLIDAY') 
          and dates_generate not in  
          (select substitute_date from day_sub_detail_tbl where  
          to_char(substitute_date,'yyyy') between to_char(to_date($2,'YYYY-MM-DD'),'YYYY') and to_char(to_date($3,'YYYY-MM-DD'),'YYYY') 
          and to_char(substitute_date,'YYYY-MM-DD') between  $2 and $3)`,
        [employee_id, leave_date_from, leave_date_to],
        (error, results) => {
          if (error) {
            throw error;
          }
          if (results.rows.length > 0) {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: results.rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: employee_id,
              data: [],
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
