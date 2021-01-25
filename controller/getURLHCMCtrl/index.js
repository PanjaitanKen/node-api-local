const pool = require('../../db')

//Tabel : Param_HCM
var controller = {
    getURL_HCM: function(request, response) {
        try {
            pool.db_HCM.query("select setting_value as url_hcm from param_hcm where setting_name ='URL API HCM'", (error, results) => {
                if (error) {
                    throw error
                }
                if(results.rows != ''){
                    response.status(200).send({
                        status: 200,
                        message: 'Load Data berhasil',
                        data: results.rows[0]
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