const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '192.168.0.111',
  database: 'MMFPROD',
  password: 'Kutubuku123',
  port: 5433,
})

const getBirthDate = (request, response) => {
    pool.query('SELECT birth_date FROM person_tbl ', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const getBirthDatebyId = (request, response) => {
    const id = request.params.id
    console.log(id);
    pool.query("SELECT to_char(birth_date,'MM-DD-YYYY') as birth_Date FROM person_tbl WHERE person_id = $1", [id], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
}

const datePost = (request, response) => {
    const { employee_id } = request.body
    console.log (request.body)
  
    pool.query("SELECT to_char(birth_date,'MM-DD-YYYY') as birth_Date FROM person_tbl WHERE person_id = $1", [employee_id], (error, results) => {
      if (error) {
        throw error
      }
      if(results.rows != ''){
        response.status(200).json(results.rows)
      }else{
        response.status(500).json("data tidak ditemukan")
      }
    })
  }

module.exports = {
    getBirthDate,
    getBirthDatebyId,
    datePost
}