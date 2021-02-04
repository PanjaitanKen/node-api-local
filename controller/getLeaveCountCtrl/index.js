const pool = require('../../db')

//Tabel : emp_work_schedule_tbl
var controller = {
    getLeave_Count : function (request, response) {
        try {
            const { employee_id , leave_date_from, leave_date_to } = request.body
             console.log (request.body)

            pool.db_MMFPROD.query(
                "select count(*)-1 jumlah_cuti_diambil from ( "+
                     " select * from generate_series(date_trunc('month',now()), "+
                                " date_trunc('month',now()) + '1 month' - '1 day'::interval,'1 day') as dates_this_month "+
                    " ) a "+
                " where to_char(dates_this_month,'YYYY-MM-DD') between $2 and $3 "+
                " and date_part('dow',dates_this_month) not in  "+
                " (select b.day_sequence from emp_work_schedule_tbl a "+
                    " left join work_schedule_cycle_tbl b on a.schedule_type =b.schedule_type  "+
                    " where current_date between valid_from and valid_to and a.employee_id = $1 and b.day_type ='OFFHOLIDAY') "+
                    " and dates_this_month not in  "+
                        " (select substitute_date from day_sub_detail_tbl where "+
                        " to_char(substitute_date,'yyyy') between to_char(to_date($2,'YYYY-MM-DD'),'YYYY') and to_char(to_date($3,'YYYY-MM-DD'),'YYYY') "+
                        " and to_char(substitute_date,'YYYY-MM-DD') between  $2 and $3)	" 
                , [employee_id, leave_date_from, leave_date_to], (error, results) => {
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