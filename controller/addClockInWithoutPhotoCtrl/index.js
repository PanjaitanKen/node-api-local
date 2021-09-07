const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
const controller = {
  async addClockInWithoutPhoto(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    try {
      const {
        employee_id,
        latitude,
        altitude,
        longitude,
        accuracy,
        location_no,
        timeZoneAsia,
      } = request.body;

      Helpers.logger(
        'SUCCESS',
        {
          employee_id,
          latitude,
          altitude,
          longitude,
          accuracy,
          location_no,
          timeZoneAsia,
        },
        'AddClockInCtrl.AddClock_In'
      );

      const employee_id2 = employee_id;

      const randomNumber = Math.floor(Math.random() * 90000) + 10000;
      const url_path = null;
      let time_stamp_convert = 'Asia/jakarta';
      if (timeZoneAsia === 'WITA') time_stamp_convert = 'Asia/Makassar';
      else if (timeZoneAsia === 'WIT') time_stamp_convert = 'Asia/Jayapura';

      await pool.db_MMFPROD
        .query(
          `select count(*) as num_rows from emp_clocking_temp_tbl
          where employee_id = '${employee_id}' 
            and to_char(clocking_date, 'YYYY-MM-DD') = to_char(current_date, 'YYYY-MM-DD')
            and IN_OUT='0'`
        )
        .then(async ({ rows }) => {
          if (rows[0].num_rows > 0) {
            response.status(201).send({
              status: 201,
              message: 'Absen Masuk Berhasil',
              data: 1,
            });
          } else {
            await pool.db_MMFPROD
              .query(
                "insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,location_method , golid,golversion ) values ('MMF',$1, ((to_char(CURRENT_TIMESTAMP AT TIME ZONE $11,'YYYY-MM-DD')||' '||to_Char(CURRENT_TIMESTAMP AT TIME ZONE $11,'HH24:MI:SS'))::timestamp)  , 0, null, null, 'Transfer data by HCM to Clocking Date: '|| to_char(current_date,'DD Mon YYYY') ||' - '||to_char((CURRENT_TIMESTAMP AT TIME ZONE $11),'HH24:MI:SS')||' '||$10 , null , 'Prepared',$2, $3 , $4, $5, $6, $7, null, 'mfinhr19-'||to_char(current_date,'YYYYMMDD')||'-'||TO_CHAR(current_date,'HHMMSS')||'-'||$9||'-'||$8||'-in'||'.jpg', 1,nextval('emp_clocking_temp_tbl_golid_seq'),1)",
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
                await pool.db_HCM
                  .query(
                    "insert into emp_clocking_hcm (company_id ,employee_id ,clocking_date ,in_out , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name, location_method) values ('MMF',$1, ((to_char(CURRENT_TIMESTAMP AT TIME ZONE $11,'YYYY-MM-DD')||' '||to_Char(CURRENT_TIMESTAMP AT TIME ZONE $11,'HH24:MI:SS'))::timestamp)  , 0, 'Transfer data by HCM to Clocking Date: '|| to_char(current_date,'DD Mon YYYY') ||' - '||to_char((CURRENT_TIMESTAMP AT TIME ZONE $11),'HH24:MI:SS')||' '||$10, 'Prepared',$2, $3 , $4, $5, $6, $7, null, 'mfinhr19-'||to_char(current_date,'YYYYMMDD')||'-'||TO_CHAR(current_date,'HHMMSS')||'-'||$9||'-'||$8||'-in'||'.jpg', 1)",
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
                      .then(({ rows }) => {
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
                        Helpers.logger(
                          'ERROR',
                          {
                            employee_id,
                            latitude,
                            altitude,
                            longitude,
                            accuracy,
                            location_no,
                            timeZoneAsia,
                          },
                          'AddClockInCtrl.AddClock_In',
                          error
                        );

                        throw error;
                      });
                  })
                  .catch((error) => {
                    Helpers.logger(
                      'ERROR',
                      {
                        employee_id,
                        latitude,
                        altitude,
                        longitude,
                        accuracy,
                        location_no,
                        timeZoneAsia,
                      },
                      'AddClockInCtrl.AddClock_In',
                      error
                    );

                    throw error;
                  });
              })
              .catch((error) => {
                Helpers.logger(
                  'ERROR',
                  {
                    employee_id,
                    latitude,
                    altitude,
                    longitude,
                    accuracy,
                    location_no,
                    timeZoneAsia,
                  },
                  'AddClockInCtrl.AddClock_In',
                  error
                );

                throw error;
              });
          }
        });
    } catch (error) {
      response.status(500).send(error);
    }
  },
};

module.exports = controller;
