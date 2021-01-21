const pool = require('../../db')

//Tabel : employee_work_off_tbl, wage_code_tbl
var controller = {
    getDetailHist_attendance: function(request, response) {
        const { employee_id } = request.body
        console.log (request.body)
    
        pool.db_MMFPROD.query("select b.wage_name as jenis_ijin, a.employee_id as Nokar, to_char(work_off_from,'DD Mon YYYY') ||' - '|| to_char(work_off_to,'DD Mon YYYY') tglIjin, work_off_from::timestamp::time ||' - '||work_off_to::timestamp::time Waktu, reason alasan, to_char(clocking_date,'DD-MM-YYYY') as tglpengajuan, case when state='Approved' then 'Disetujui' when state='Rejected' then 'Ditolak' when state='Submitted' then 'Menunggu Persetujuan' when state='Cancelled' then 'Batal' end as Status from employee_work_off_tbl a left join wage_code_tbl b on a.absence_wage =b.wage_code where employee_id=$1 order by clocking_date desc", [employee_id], (error, results) => {
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