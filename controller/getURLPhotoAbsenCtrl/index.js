const pool = require('../../db')

//Tabel : Param_HCM
var controller = {
    getURL_Photo_Absen: function(request, response) {
        pool.db_HCM.query("select setting_value from param_hcm where setting_name='URL PHOTO ABSEN HCM'", (error, results) => {
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