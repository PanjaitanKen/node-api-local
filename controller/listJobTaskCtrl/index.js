const pool = require('../../db')

//Tabel : employeeworkofftbl, leaverequest_tbl
var controller = {
    getListJobTask: function(request, response) {
        const { employee_id } = request.body
        console.log (request.body)

        pool.db_MMFPROD.query("select 'Persetujuan Work Off' Keterangan,initcap(c.display_name) nama , case  when current_date-clocking_date=0 then 'Hari ini' when current_date-clocking_date=1 then 'Kemarin' when current_date-clocking_date=2 then '2 Hari yang lalu' when current_date-clocking_date=3 then '3 Hari yang lalu' when current_date-clocking_Date=4 then '4 Hari yang lalu' when current_date-clocking_Date=5 then '5 Hari yang lalu' when current_date-clocking_Date=6 then '6 Hari yang lalu' when current_date-clocking_Date=7 then '7 Hari yang lalu' when current_date-clocking_Date>7 then to_char(clocking_date,'DD Mon YYYY') end Durasi_Waktu ,a.golid from employee_work_off_tbl a left join employee_tbl  b on a.employee_id = b.employee_id left join person_tbl c on b.person_id =c.person_id where a.state='Submitted' and a.employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id =$1 and valid_to=date'9999-01-01') union all select 'Persetujuan Cuti' Keterangan,initcap(c.display_name) nama, case  when current_date-request_date=0 then 'Hari ini' when current_date-request_date=1 then 'Kemarin' when current_date-request_date=2 then '2 Hari yang lalu' when current_date-request_date=3 then '3 Hari yang lalu' when current_date-request_date=4 then '4 Hari yang lalu' when current_date-request_date=5 then '5 Hari yang lalu' when current_date-request_date=6 then '6 Hari yang lalu' when current_date-request_date=7 then '7 Hari yang lalu' when current_date-request_date>7 then to_char(request_date,'DD Mon YYYY') end Durasi_Waktu ,a.golid from leave_request_tbl  a left join employee_tbl  b on a.employee_id = b.employee_id left join person_tbl c on b.person_id =c.person_id where a.state='Submitted' and  a.employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id = $1 and valid_to=date'9999-01-01')", [employee_id], (error, results) => {
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