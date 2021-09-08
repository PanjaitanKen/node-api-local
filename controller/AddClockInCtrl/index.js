const fs = require('fs');
const dateFormat = require('dateformat');
const axios = require('axios');
const pool = require('../../db');

const serve = process.env.URL;

// Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
const controller = {
  async AddClock_In(request, response) {
    try {
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

      // insert log activity user -- start
      const data = {
        employee_id,
        menu: 'Absen Masuk',
      };

      const options = {
        headers: {
          'Content-Type': 'application/json',
          API_KEY: process.env.API_KEY,
        },
      };

      axios
        .post(`${process.env.URL}/hcm/api/addLogUser`, data, options)
        .then((res) => {
          console.log('RESPONSE ==== : ', res.data);
        })
        .catch((err) => {
          console.log('ERROR: ====', err);
          throw err;
        });
      // insert log activity user -- end

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

      const query =
        "insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,location_method , golid,golversion ) values ('MMF',$1, ((to_char(CURRENT_TIMESTAMP AT TIME ZONE $11,'YYYY-MM-DD')||' '||to_Char(CURRENT_TIMESTAMP AT TIME ZONE $11,'HH24:MI:SS'))::timestamp)  , 0, null, null, 'Transfer data by HCM to Clocking Date: '|| to_char(current_date,'DD Mon YYYY') ||' - '||to_char((CURRENT_TIMESTAMP AT TIME ZONE $11),'HH24:MI:SS')||' '||$10 , null , 'Prepared',$2, $3 , $4, $5, $6, $7, null, 'mfinhr19-'||to_char(current_date,'YYYYMMDD')||'-'||TO_CHAR(current_date,'HHMISS')||'-'||$9||'-'||$8||'-in'||'.jpg', 1,nextval('emp_clocking_temp_tbl_golid_seq'),1)";
      await pool.db_MMFPROD
        .query(query, [
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
        ])
        .then(async () => {
          await pool.db_HCM
            .query(
              "insert into emp_clocking_hcm (company_id ,employee_id ,clocking_date ,in_out , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name, location_method) values ('MMF',$1, ((to_char(CURRENT_TIMESTAMP AT TIME ZONE $11,'YYYY-MM-DD')||' '||to_Char(CURRENT_TIMESTAMP AT TIME ZONE $11,'HH24:MI:SS'))::timestamp) , 0, 'Transfer data by HCM to Clocking Date: '|| to_char(current_date,'DD Mon YYYY') ||' - '||to_char((CURRENT_TIMESTAMP AT TIME ZONE $11),'HH24:MI:SS')||' '||$10, 'Prepared',$2, $3 , $4, $5, $6, $7, null, 'mfinhr19-'||to_char(current_date,'YYYYMMDD')||'-'||TO_CHAR(current_date,'HHMISS')||'-'||$9||'-'||$8||'-in'||'.jpg', 1)",
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
              ]
            )
            .then(async () => {
              await pool.db_MMFPROD
                .query(
                  'SELECT COUNT(*) FROM emp_clocking_tbl where clocking_date =current_date and employee_id =$1',
                  [employee_id]
                )
                .then(async ({ rows }) => {
                  // eslint-disable-next-line eqeqeq
                  if (rows[0].count == 0) {
                    response.status(201).send({
                      status: 201,
                      message: 'Absen Masuk Berhasil',
                      data: 2,
                    });
                  } else {
                    response.status(201).send({
                      status: 201,
                      message: 'Absen Masuk Berhasil',
                      data: 1,
                    });
                  }
                })
                .catch((error) => {
                  throw error;
                });
            })
            .catch((error) => {
              throw error;
            });
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      response.status(500).send(error);
    }
  },
};

module.exports = controller;
