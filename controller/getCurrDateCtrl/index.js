const pool = require('../../db')

//Tabel : -
var controller = {
    getCurrDate: function(request, response) {
        try {
            pool.db_MMFPROD.query("select current_timestamp as tgl1,current_date tgl2, timeofday()  as tgl3, NOW()::TIMESTAMP tgl4 from dual", (error, results) => {
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