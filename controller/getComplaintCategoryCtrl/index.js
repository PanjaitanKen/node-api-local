const pool = require('../../db')

//Tabel : mas_kategori_komplain
var controller = {
    getKategori_Komplain: function (request, response) {
        try {
            const { employee_id } = request.body
            // console.log (request.body)

            pool.db_HCM.query(
                "select id_kategori_komplain,ket_kategori, email_to,cc_to, subject_email " +
                "from mas_kategori_komplain mkk " +
                "order by id_kategori_komplain", (error, results) => {
                    if (error) {
                        throw error
                    }
                    if (results.rows != '') {
                        response.status(200).send({
                            status: 200,
                            message: 'Load Data berhasil',
                            data: results.rows
                        });
                    } else {
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