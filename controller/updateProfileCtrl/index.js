const pool = require('../../db');

// Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
const controller = {
  updateProfile(request, response) {
    try {
      const { employee_id, phone_number } = request.body;

      pool.db_MMFPROD.query(
        `select b.person_id ,a.employee_id ,
        max(case when c.contact_type ='3' and default_address ='Y' then contact_value else ' ' end) as no_hp,
        max(case when c.contact_type ='4' and default_address ='Y' then contact_value else ' ' end) as email
        from employee_tbl a
        left join person_tbl b on a.person_id =b.person_id 
        left join person_contact_method_tbl c on b.person_id = c.person_id 
        where employee_id = $1
        group by b.person_id ,a.employee_id`,
        [employee_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            pool.db_MMFPROD.query(
              `update person_contact_method_tbl set contact_value = coalesce($2,' ')
              where contact_type = '3' and default_address ='Y'
              and person_id in (select person_id from employee_tbl where employee_id = $1)`,
              [employee_id, phone_number],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rowCount != 0) {
                  response.status(201).send({
                    status: 202,
                    message: 'Update Success',
                    validate_id: employee_id,
                    data: '',
                  });
                } else {
                  response.status(201).send({
                    status: 200,
                    message: 'Update Failed',
                    validate_id: employee_id,
                    data: '',
                  });
                }
              }
            );
          } else {
            pool.db_MMFPROD.query(
              `insert into person_contact_method_tbl (person_id ,contact_no ,contact_value ,default_address ,contact_type ,
                validate_code, golversion ) values
                ((select person_id  from employee_tbl where employee_id = $1), (SELECT max(contact_no)+1 FROM person_contact_method_tbl),
                $2,'Y','3',null, '100')`,
              [employee_id, phone_number],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rowCount != 0) {
                  response.status(201).send({
                    status: 201,
                    message: 'insert Success',
                    validate_id: employee_id,
                    data: '',
                  });
                } else {
                  response.status(201).send({
                    status: 201,
                    message: 'Insert failed',
                    validate_id: employee_id,
                    data: '',
                  });
                }
              }
            );
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
};

module.exports = controller;
