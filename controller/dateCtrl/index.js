const pool = require('../../db');

// Tabel : person_tbl, employee_tbl
const controller = {
  getBirthDate(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_MMFPROD.query(
        "SELECT b.employee_id,to_char(birth_date,'MM-DD-YYYY') as birth_Date FROM person_tbl a left join employee_tbl b on a.person_id =b.person_id WHERE b.employee_id = $1 and to_char(birth_date,'DDMM')=to_char(current_date ,'DDMM')",
        [employee_id],
        (error, results) => {
          if (error) throw error;

          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data Berhasil',
              data: results.rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              data: results.rows,
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
