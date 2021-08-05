const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
const controller = {
  addClockOutWithoutPhoto(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

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
      'AddClockOutCtrl.AddClock_Out'
    );

    try {
      const employee_id2 = employee_id;

      const randomNumber = Math.floor(Math.random() * 90000) + 10000;

      const url_path = null;
      let time_stamp_convert = 'Asia/jakarta';

      if (timeZoneAsia === 'WITA') {
        time_stamp_convert = 'Asia/Makassar';
      } else if (timeZoneAsia === 'WIT') {
        time_stamp_convert = 'Asia/Jayapura';
      }

      pool.db_MMFPROD.query(
        "insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,location_method , golid,golversion ) values ('MMF',$1,(CURRENT_TIMESTAMP AT TIME ZONE $11), 1, null, null, 'Transfer data by HCM to Clocking Date: '|| to_char(current_date,'DD Mon YYYY') ||' - '||to_char((CURRENT_TIMESTAMP AT TIME ZONE $11),'HH24:mm:ss')||' '||$10 , null , 'Prepared',$2, $3 , $4, $5, $6, $7, null, 'mfinhr19-'||to_char(current_date,'YYYYMMDD')||'-'||TO_CHAR(current_date,'HHMMSS')||'-'||$9||'-'||$8||'-out'||'.jpg', 1,nextval('emp_clocking_temp_tbl_golid_seq'),1)",
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
          if (error) {
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
              'AddClockOutCtrl.AddClock_Out',
              error
            );

            throw error;
          }
          pool.db_HCM.query(
            "insert into emp_clocking_hcm (company_id ,employee_id ,clocking_date ,in_out , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,location_method) values ('MMF',$1,(CURRENT_TIMESTAMP AT TIME ZONE $11), 1, 'Transfer data by HCM to Clocking Date: '|| to_char(current_date,'DD Mon YYYY') ||' - '||to_char((CURRENT_TIMESTAMP AT TIME ZONE $11),'HH24:mm:ss')||' '||$10, 'Prepared',$2, $3 , $4, $5, $6, $7, null, 'mfinhr19-'||to_char(current_date,'YYYYMMDD')||'-'||TO_CHAR(current_date,'HHMMSS')||'-'||$9||'-'||$8||'-out'||'.jpg', 1)",
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
              if (error) {
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
                  'AddClockOutCtrl.AddClock_Out',
                  error
                );

                throw error;
              }
              pool.db_MMFPROD.query(
                'SELECT COUNT(*) FROM emp_clocking_tbl where clocking_date =current_date and employee_id =$1',
                [employee_id],
                (error, results) => {
                  if (error) {
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
                      'AddClockOutCtrl.AddClock_Out',
                      error
                    );

                    throw error;
                  }

                  // eslint-disable-next-line eqeqeq
                  if (results.rows[0].count == 0) {
                    response.status(201).send({
                      status: 201,
                      message: 'Absen Pulang Berhasil',
                      data: 3,
                    });
                  } else {
                    pool.db_MMFPROD.query(
                      'SELECT time_out FROM emp_clocking_detail_tbl where clocking_date =current_date and employee_id = $1',
                      [employee_id],
                      (error, results) => {
                        if (error) {
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
                            'AddClockOutCtrl.AddClock_Out',
                            error
                          );

                          throw error;
                        }
                        // eslint-disable-next-line eqeqeq
                        if (results.rows != '') {
                          if (
                            // eslint-disable-next-line operator-linebreak
                            // eslint-disable-next-line eqeqeq
                            results.rows[0].time_out == '' ||
                            results.rows[0].time_out == null
                          ) {
                            response.status(201).send({
                              status: 201,
                              message: 'Absen Pulang Berhasil',
                              data: 2,
                            });
                          } else {
                            response.status(201).send({
                              status: 201,
                              message: 'Absen Pulang Berhasil',
                              data: 1,
                            });
                          }
                        } else {
                          response.status(201).send({
                            status: 201,
                            message: 'Absen Pulang Berhasil',
                            data: 1,
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          );
        }
      );
    } catch (error) {
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
        'AddClockOutCtrl.AddClock_Out',
        error
      );

      response.status(500).send(error);
    }
  },
};

module.exports = controller;
