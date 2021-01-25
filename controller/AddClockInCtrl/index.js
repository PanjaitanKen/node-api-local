const pool = require('../../db')
var fs = require('fs');

//Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
var controller = {
    AddClock_In: function(request, response) {
    const { employee_id, latitude, altitude, longitude, accuracy, location_no}  = request.body
    const {employee_id2} = employee_id;
    // console.log (employee_id, latitude, altitude, longitude, accuracy, location_no)

    //get image from base64
    var base64Data = request.body.photo.replace(/^data:image\/png;base64,/, "");
    let randomNumber = Math.floor(Math.random()*90000) + 10000;

    var dateFormat = require('dateformat');
    var day=dateFormat(new Date(), "yyyy-mm-dd-hh-MM-ss");
    // console.log(day);
    
  
    //local
    // var dir = './uploads/'+ employee_id +'/';
    //server
    var dir = './uploads/'+ employee_id +'/';

    // console.log (dir)

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    let fileName = 'mfinhr19'+'-'+ day+ '-'+ 'mandala-'  + randomNumber + '-'+'in'+ '.jpg';
    require("fs").writeFile(dir+ fileName, base64Data, 'base64', function(err) {
      // console.log(err);
    });
      
    //server development
    let url_path = "http://dev-hcm.mandalafinance.co.id:3000" + dir + fileName;
    // console.log(url_path);

    pool.db_MMFPROD.query("insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,location_method , golid,golversion ) values ('MMF',$1,current_timestamp, 0, null, null, null, 'Transfer to Clocking Date:'|| to_char(current_date,'DD Mon YYYY'), 'Transfered',$2, $3 , $4, $5, $6, $7, null, 'mfinhr19-'||to_char(current_date,'YYYYMMDD')||'-'||TO_CHAR(current_date,'HHMMSS')||'-'||$9||'-'||$8||'-in'||'.jpg', 1,nextval('emp_clocking_temp_tbl_golid_seq'),1)", [employee_id, latitude, altitude, longitude, accuracy, location_no, url_path, randomNumber,employee_id2], (error, results) => {
      if (error) {
        throw error
      }
      pool.db_MMFPROD.query("SELECT COUNT(*) FROM emp_clocking_tbl where clocking_date =current_date and employee_id =$1", [employee_id], (error, results) => {
        if (error) {
          throw error
        }
        if(results.rows[0].count == 0){
          pool.db_MMFPROD.query("insert into emp_clocking_detail_tbl (company_id,employee_id,clocking_date,time_in,time_out,off_site,is_break,note,in_terminal, out_terminal, in_reg_type, out_reg_type, absence_wage, in_location,out_location,golid,golversion) values ('MFIN',$1,current_date, CURRENT_TIMESTAMP, null, null, 'N', null, ' ',' ' ,5, null, null, ' 267', null, nextval('emp_clocking_detail_tbl_golid_seq'),1 );", [employee_id], (error, results) => {
            if (error) {
              throw error
            }
            pool.db_MMFPROD.query("insert into emp_clocking_tbl (company_id ,employee_id ,clocking_date ,result_revised ,presence ,normal_hour ,overtime_hour , absence_hour ,late_hour ,early_hour ,overtime_paid ,temp_day_type ,revised_company ,revised_by ,calc_day_type ,normal_hour_off , late_in_wage ,early_out_wage ,early_break_hour ,late_break_hour ,state ,golid ,golversion ) values ('MMF',$1,current_date,null,0,0,0,0,0,0,0,null,null,null,null,0,null,null,0,0,'Prepared',nextval('emp_clocking_tbl_golid_seq'),1);", [employee_id], (error, results) => {
              if (error) {
                throw error
              }
                response.status(201).send({
                  status: 201,
                  message: 'Absen Masuk Berhasil',
                  data: ""
                });
              })
            })
        }else{
          response.status(201).send({
            status: 201,
            message: 'Absen Masuk Berhasil',
            data: ""
          });
        }
      })
    })
  }
};

module.exports = controller;