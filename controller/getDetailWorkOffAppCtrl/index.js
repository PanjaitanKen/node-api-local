const pool = require('../../db')

//Tabel : leave_request_tbl, employeetbl, persontbl
var controller = {
    getDetail_WorkOff_App: function (request, response) {
        try {
            const { golid } = request.body
            console.log(request.body)

            pool.db_MMFPROD.query("select a.employee_id, initcap(a.leave_name)  as jenis_cuti, initcap(d.display_name) as nama, to_char(leave_date_from,'MM-DD-YYYY') as tgl_cuti_dr, to_char(leave_date_to,'MM-DD-YYYY') as tgl_cuti_sd, reason as alasan,TO_CHAR(a.request_date,'MM-DD-YYYY') as tgl_pengajuan,a.golid, case when a.state='Approved' then 'Disetujui' when a.state='Rejected' then 'Ditolak' when a.state='Submitted' then 'Menunggu Persetujuan' when a.state='Cancelled' then 'Batal' end as Status, TO_CHAR(a.working_date,'MM-DD-YYYY') as tgl_bekerja_kembali,CAST(request_days AS INT) as lama_cuti from leave_request_tbl a left join employee_tbl c on a.employee_id =c.employee_id left join person_tbl d on c.person_id =d.person_id where state='Submitted' and a.golid =$1 ", [golid], (error, results) => {
                if (error) {
                    throw error
                }
                if (results.rows != '') {
                    response.status(200).send({
                        status: 200,
                        message: 'Load Data berhasil',
                        data: results.rows[0]
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