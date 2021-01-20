const pool = require('../../db')

//Tabel : mark_location_tbl
var controller = {
  getLongitude_Branch: function(request, response) {
    pool.db_MMFPROD.query("select location_name, latitude,longitude from mark_location_tbl order by location_no asc", (error, results) => {
      if (error) {
        throw error
      }
      if(results.rows != ''){
        response.status(200).json(results.rows)
      }else{
        response.status(400).json("data tidak ditemukan")
      }
    })
  }
};

module.exports = controller;