const pool = require('../../db')

//Tabel : person_tbl, faskes_tbl, employee_tbl
var controller = {
    getBPJS_Info: function (request, response) {
        try {
            const { employee_id } = request.body
            // console.log (request.body)

            pool.db_MMFPROD.query(
                    "select c.employee_id, bpjsk_no ,bpjsk_join_date as tgl_bergabung_bpjsk,"+
                    " a.faskes_code,b.faskes_name ,b.faskes_type, kelas_rawat "+
                    " from person_tbl a "+
                    " left join faskes_tbl b on a.faskes_code =b.faskes_code  "+
                    " left join employee_tbl c on a.person_id =c.person_id  "+
                    "where c.employee_id = $1 ", [employee_id], (error, results) => {
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