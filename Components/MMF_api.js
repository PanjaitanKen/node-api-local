const pool = require('../db')

const getBirthDate = (request, response) => {
  pool.db.query('SELECT birth_date FROM person_tbl ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getBirthDatebyId = (request, response) => {
  const id = request.params.id
  console.log(id);
  pool.db.query("SELECT to_char(birth_date,'MM-DD-YYYY') as birth_Date FROM person_tbl WHERE person_id = $1", [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// Tabel : person_tbl
const datePost = (request, response) => {
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

//Tabel : employeeworkofftbl, leaverequest_tbl
const getCountJobTask = (request, response) => {
  const { employee_id } = request.body
  console.log (request.body)

  pool.db.query("select sum(jumlahJobTask) jumlahJobTask from (select count(*) jumlahJobTask from employee_work_off_tbl where state='Submitted' and employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id =$1 and valid_to=date'9999-01-01')	union all select count(*) jumlahJobTask from leave_request_tbl where state='Submitted'and employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id =$1 and valid_to=date'9999-01-01')) a", [employee_id], (error, results) => {
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

//Tabel : employeeworkofftbl, leaverequest_tbl
const getListJobTask = (request, response) => {
  const { employee_id } = request.body
  console.log (request.body)

  pool.db.query("select 'Persetujuan Work Off' Keterangan,B.display_name , case  when current_date-clocking_date=0 then 'Hari ini' when current_date-clocking_date=1 then 'Kemarin' when current_date-clocking_date=2 then '2 Hari yang lalu' when current_date-clocking_date=3 then '3 Hari yang lalu' when current_date-clocking_Date=4 then '4 Hari yang lalu' when current_date-clocking_Date=5 then '5 Hari yang lalu' when current_date-clocking_Date=6 then '6 Hari yang lalu' when current_date-clocking_Date=7 then '7 Hari yang lalu' when current_date-clocking_Date>7 then to_char(clocking_date,'DD Mon YYYY') end Durasi_Waktu ,a.golid from employee_work_off_tbl a left join person_tbl b on a.employee_id =b.person_id where state='Submitted' and employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id =$1 and valid_to=date'9999-01-01') union all select 'Persetujuan Cuti' Keterangan,b.display_name, case  when current_date-request_date=0 then 'Hari ini'when current_date-request_date=1 then 'Kemarin' when current_date-request_date=2 then '2 Hari yang lalu' when current_date-request_date=3 then '3 Hari yang lalu' when current_date-request_date=4 then '4 Hari yang lalu' when current_date-request_date=5 then '5 Hari yang lalu' when current_date-request_date=6 then '6 Hari yang lalu' when current_date-request_date=7 then '7 Hari yang lalu' when current_date-request_date>7 then to_char(request_date,'DD Mon YYYY') end Durasi_Waktu ,a.golid from leave_request_tbl  a left join person_tbl b on a.employee_id =b.person_id where state='Submitted' and  employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id =$1 and valid_to=date'9999-01-01')	", [employee_id], (error, results) => {
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

  
//Tabel : mark_location_tbl
const getLongitude_Branch = (request, response) => {
  pool.db.query("select location_name, latitude,longitude from mark_location_tbl order by location_no asc", (error, results) => {
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


module.exports = {
    getBirthDate,
    getBirthDatebyId,
    datePost,
    getCountJobTask,
    getListJobTask,
    getLongitude_Branch,
}