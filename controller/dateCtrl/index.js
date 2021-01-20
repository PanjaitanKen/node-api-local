const pool = require('../../db')

// Tabel : person_tbl
var controller = {
    datePost: function(request, response) {
        const { employee_id } = request.body
        console.log (request.body)
    
        pool.db.query("SELECT to_char(birth_date,'MM-DD-YYYY') as birth_Date FROM person_tbl WHERE person_id = $1", [employee_id], (error, results) => {
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