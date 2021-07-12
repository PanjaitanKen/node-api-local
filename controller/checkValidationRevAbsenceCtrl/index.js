const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  checkValidationRevAbsence(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, date_filter } = request.body;

    Helpers.logger(
      'SUCCESS',
      {
        employee_id,
        date_filter,
      },
      'getDescAbsenceCtrl.getDescAbsence'
    );

    try {
      pool.db_MMFPROD.query(
        `select count(*) validasi from (
	        select employee_id
	        from employee_work_off_tbl where  
	          employee_id =  $1 and clocking_date = $2
	          union all
	        select employee_id from  
	          emp_clocking_detail_tbl where (absence_wage like 'CT_%' or note like '%Travel%')
	          and employee_id =$1 and clocking_date = $2
	         union all
	          select employee_id from emp_clocking_tbl
	          where employee_id =$1 and clocking_date = $2
	        and (state in ('Approved','Transfered') or result_revised = 'N')
	         union all
	        select employee_id from rev_absence_hcm 
	         where employee_id =$1 and clocking_date = $2
	          and state in ('Approved','Submitted')
	        ) a`,
        [employee_id, date_filter],
        (error, results) => {
          if (error) {
            Helpers.logger(
              'ERROR',
              {
                employee_id,
                date_filter,
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
              data: results.rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
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
          date_filter,
        },
        'getDescAbsenceCtrl.getDescAbsence',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
