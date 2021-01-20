const pool = require('../../db')

// Tabel : person_tbl, employee_tbl
var controller = {
    getBirthDate: function(request, response) {
        const { employee_id } = request.body
        console.log (request.body)
    
        pool.db_MMFPROD.query("SELECT b.employee_id,to_char(birth_date,'MM-DD-YYYY') as birth_Date FROM person_tbl a left join employee_tbl b on a.person_id =b.person_id WHERE b.employee_id = $1 and to_char(birth_date,'DDMM')=to_char(current_date ,'DDMM')", [employee_id], (error, results) => {
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