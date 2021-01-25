const pool = require('../../db')

//Tabel : mark_location_tbl
var controller = {
  getLongitude_Branch: function(request, response) {
    try {
      pool.db_MMFPROD.query("select location_name,location_no, latitude,altitude, longitude, accuracy, radius_tolerance from mark_location_tbl order by location_no asc", (error, results) => {
        if (error) {
          throw error
        }
        if(results.rows != ''){
          response.status(200).send({
            status: 200,
            message: 'Mendapatkan Semua Data',
            data: results.rows
        });
        }else{
          response.status(200).send({
            status: 200,
            message: 'Data Tidak Ditemukan',
            data: results.rows
        });
        }
      })
    } catch (err) {
      res.status(500).send(err);
    }
  }
};

module.exports = controller;