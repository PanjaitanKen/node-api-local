const pool = require('../../db')

//Tabel : employeeworkofftbl, wagecodetbl, employeetbl, person_tbl
var controller = {
    getDetail_Att_App: function(request, response) {
        try {
            const { golid } = request.body
            // console.log (request.body)

            pool.db_MMFPROD.query("select a.employee_id, b.wage_name  as jenis_ijin, d.display_name as nama,to_char(work_off_from,'MM-DD-YYYY') as tgl_ijin_dari, to_char(work_off_to,'MM-DD-YYYY') as tgl_ijin_sd, reason as alasan,to_char(a.clocking_date,'MM-DD-YYYY') as tgl_pengajuan,a.golid, case when a.state='Approved' then 'Disetujui' when a.state='Rejected' then 'Ditolak' when a.state='Submitted' then 'Menunggu Persetujuan' when a.state='Cancelled' then 'Batal' end as Status from employee_work_off_tbl a left join wage_code_tbl b on a.absence_wage =b.wage_code left join employee_tbl c on a.employee_id =c.employee_id left join person_tbl d on c.person_id =d.person_id where state='Submitted' and a.golid =$1 ", [golid], (error, results) => {
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