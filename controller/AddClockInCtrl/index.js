const fs = require('fs');
const dateFormat = require('dateformat');
const pool = require('../../db');
const axios = require('axios');

const serve = process.env.URL;

// Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
const controller = {
  AddClock_In(request, response) {
    const {
      employee_id,
      latitude,
      altitude,
      longitude,
      accuracy,
      location_no,
      timeZoneAsia,
      photo,
    } = request.body;

    const employee_id2 = employee_id;

    //insert log activity user -- start
    const data = {
      employee_id: employee_id,
      menu: 'Absen Masuk',
    };

    const options = {
      headers: {
        'Content-Type': 'application/json',
        API_KEY: process.env.API_KEY,
      },
    };

    axios
      .post(process.env.URL + '/hcm/api/addLogUser', data, options)
      .then((res) => {
        console.log('RESPONSE ==== : ', res.data);
      })
      .catch((err) => {
        console.log('ERROR: ====', err);
      });
    //insert log activity user -- end

    // get image from base64
    const base64Data = photo.replace(/^data:image\/png;base64,/, '');

    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    const day = dateFormat(new Date(), 'yyyy-mm-dd-hh-MM-ss');
    const dir = `./uploads/${employee_id}/`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const fileName = `mfinhr19-${day}-mandala-${randomNumber}-In.jpg`;

    // eslint-disable-next-line global-require
    require('fs').writeFile(dir + fileName, base64Data, 'base64', () => {});
    const url_path = serve + dir + fileName;
    let time_stamp_convert = 'Asia/jakarta';
    if (timeZoneAsia === 'WITA') time_stamp_convert = 'Asia/Makassar';
    else if (timeZoneAsia === 'WIT') time_stamp_convert = 'Asia/Jayapura';

    pool.db_MMFPROD.query(
      "insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,location_method , golid,golversion ) values ('MMF',$1, (CURRENT_TIMESTAMP AT TIME ZONE $11) , 0, null, null, null, 'Transfer data by HCM to Clocking Date: '|| to_char(current_date,'DD Mon YYYY') ||' - '||to_char((CURRENT_TIMESTAMP AT TIME ZONE $11),'HH24:mm:ss')||' '||$10, 'Transfered',$2, $3 , $4, $5, $6, $7, null, 'mfinhr19-'||to_char(current_date,'YYYYMMDD')||'-'||TO_CHAR(current_date,'HHMMSS')||'-'||$9||'-'||$8||'-in'||'.jpg', 1,nextval('emp_clocking_temp_tbl_golid_seq'),1)",
      [
        employee_id,
        latitude,
        altitude,
        longitude,
        accuracy,
        location_no,
        url_path,
        randomNumber,
        employee_id2,
        timeZoneAsia,
        time_stamp_convert,
      ],
      (error) => {
        if (error) throw error;

        pool.db_HCM.query(
          "insert into emp_clocking_hcm (company_id ,employee_id ,clocking_date ,in_out , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name, location_method) values ('MMF',$1, (CURRENT_TIMESTAMP AT TIME ZONE $11) , 0, 'Transfer data by HCM to Clocking Date: '|| to_char(current_date,'DD Mon YYYY') ||' - '||to_char((CURRENT_TIMESTAMP AT TIME ZONE $11),'HH24:mm:ss')||' '||$10, 'Transfered',$2, $3 , $4, $5, $6, $7, null, 'mfinhr19-'||to_char(current_date,'YYYYMMDD')||'-'||TO_CHAR(current_date,'HHMMSS')||'-'||$9||'-'||$8||'-in'||'.jpg', 1)",
          [
            employee_id,
            latitude,
            altitude,
            longitude,
            accuracy,
            location_no,
            url_path,
            randomNumber,
            employee_id2,
            timeZoneAsia,
            time_stamp_convert,
          ],
          (error) => {
            if (error) throw error;

            pool.db_MMFPROD.query(
              'SELECT COUNT(*) FROM emp_clocking_tbl where clocking_date =current_date and employee_id =$1',
              [employee_id],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rows[0].count == 0) {
                  pool.db_MMFPROD.query(
                    "insert into emp_clocking_detail_tbl (company_id,employee_id,clocking_date,time_in,time_out,off_site,is_break,note,in_terminal, out_terminal, in_reg_type, out_reg_type, absence_wage, in_location,out_location,golid,golversion) values ('MFIN',$1,current_date, (CURRENT_TIMESTAMP AT TIME ZONE $3) , null, null, 'N', null, ' ',' ' ,5, null, null, $2, null, nextval('emp_clocking_detail_tbl_golid_seq'),1 );",
                    [employee_id, location_no, time_stamp_convert],
                    (error) => {
                      if (error) throw error;

                      pool.db_MMFPROD.query(
                        "insert into emp_clocking_tbl (company_id ,employee_id ,clocking_date ,result_revised ,presence ,normal_hour ,overtime_hour , absence_hour ,late_hour ,early_hour ,overtime_paid ,temp_day_type ,revised_company ,revised_by ,calc_day_type ,normal_hour_off , late_in_wage ,early_out_wage ,early_break_hour ,late_break_hour ,state ,golid ,golversion ) values ('MMF',$1,current_date,null,0,0,0,0,0,0,0,null,null,null,null,0,null,null,0,0,'Prepared',nextval('emp_clocking_tbl_golid_seq'),1);",
                        [employee_id],
                        (error) => {
                          if (error) throw error;

                          response.status(201).send({
                            status: 201,
                            message: 'Absen Masuk Berhasil',
                            data: 2,
                          });
                        }
                      );
                    }
                  );
                } else {
                  response.status(201).send({
                    status: 201,
                    message: 'Absen Masuk Berhasil',
                    data: 1,
                  });
                }
              }
            );
          }
        );
      }
    );
  },
};

module.exports = controller;
