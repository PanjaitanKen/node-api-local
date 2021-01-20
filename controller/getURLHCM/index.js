const pool = require('../../db')

//Tabel : Param_HCM
var controller = {
    getURL_HCM: function(request, response) {
        pool.db_HCM.query("select setting_value as url_hcm from param_hcm where setting_name ='URL API HCM'", (error, results) => {
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