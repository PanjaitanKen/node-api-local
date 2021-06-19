const pool = require('../../db');

// Tabel : Param_HCM
const controller = {
  getPICHRLearning(request, response) {
    try {
      pool.db_HCM.query(
        `  select setting_value as no_hp_pic,description AS nama_pic
        from param_hcm 
        where setting_name ='PIC HR LEARNING'`,
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
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
