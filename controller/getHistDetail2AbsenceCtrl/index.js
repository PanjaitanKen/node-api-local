const pool = require('../../db');

// Tabel : emp_clocking_temp_tbl
const controller = {
  getHist_Detail2_Absence(request, response) {
    try {
      const { employee_id, clocking_date } = request.body;

      pool.db_MMFPROD.query(
        "select employee_id ,clocking_date ,to_char(work_off_from ,'HH24:MM') jam_ijin_dari, to_char(work_off_to ,'HH24:MM') jam_ijin_sd from employee_work_off_tbl where employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD')=$2 ",
        [employee_id, clocking_date],
        (error, results) => {
          if (error) throw error;

          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: results.rows,
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
