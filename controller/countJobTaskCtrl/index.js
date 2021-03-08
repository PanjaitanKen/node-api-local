const pool = require('../../db');

// Tabel : employeeworkofftbl, leaverequest_tbl
const controller = {
  getCountJobTask(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_MMFPROD.query(
        ' select sum(jumlahJobTask) jumlahJobTask,  ' +
          ' (select count(*) as atasan  ' +
          ' from employee_supervisor_tbl ' +
          " where supervisor_id = $1 and valid_to=date'9999-01-01') atasan " +
          ' from  ' +
          " (select count(*) jumlahJobTask from employee_work_off_tbl where state='Submitted' " +
          ' and employee_id in (select employee_id from employee_supervisor_tbl ' +
          " where supervisor_id =$1 and valid_to=date'9999-01-01') " +
          ' union all select count(*) jumlahJobTask ' +
          " from leave_request_tbl where state='Submitted' " +
          " and employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id =$1 and valid_to=date'9999-01-01') " +
          ' union all  ' +
          ' select count(*) jumlahJobTask from travel_request_tbl  a  ' +
          ' left join employee_tbl  b on a.employee_id = b.employee_id   ' +
          ' left join person_tbl c on b.person_id =c.person_id ' +
          ' where a.golid in  ' +
          ' (select ref_id from  ' +
          ' approval_structure_tbl ' +
          " where class_name ='com.sps.travelexpense.transaction.TravelRequest' " +
          " and approver_id = $1 and ref_id||trim(to_char(approval_sequence,'999999')) in  " +
          ' ( ' +
          " with x as (select ref_id,trim(to_char(min(approval_sequence),'999999'))  as seq_min " +
          ' from approval_structure_tbl  ' +
          " where class_name ='com.sps.travelexpense.transaction.TravelRequest' " +
          " and state='Unapproved' and ref_id  in  " +
          ' (select golid from travel_request_tbl trt ' +
          " where  state in ('Submitted','Partially Approved') " +
          ' and employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id in ' +
          " (select employee_id from employee_supervisor_tbl where supervisor_id =  $1 and valid_to=date'9999-01-01') " +
          " and valid_to=date'9999-01-01' " +
          ' union all ' +
          " select employee_id from employee_supervisor_tbl where supervisor_id = $1 and valid_to=date'9999-01-01') " +
          ' )	 ' +
          ' group by ref_id	) ' +
          ' select ref_id||seq_min as ref_id_min  ' +
          ' from x ' +
          ' ) ' +
          " and state='Unapproved' " +
          ' ) ' +
          ' ) a	 ',
        [employee_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: results.rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: employee_id,
              data: results.rows,
            });
          }
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
