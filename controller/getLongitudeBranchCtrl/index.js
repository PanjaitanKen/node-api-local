const pool = require('../../db')

//Tabel : mark_location_tbl
var controller = {
  getLongitude_Branch: function(request, response) {
    pool.db_MMFPROD.query("select location_name,location_no, latitude,altitude, longitude, accuracy, radius_tolerance from mark_location_tbl order by location_no asc", (error, results) => {
      if (error) {
        throw error
      }
      if(results.rows != ''){
        response.status(200).json(results.rows)
      }else{
        response.status(400).json("")
      }
    })
  }
};

module.exports = controller;