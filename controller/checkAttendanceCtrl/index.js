const pool = require('../../db');

// Tabel : employeeworkofftbl, leaverequest_tbl
const controller = {
  checkAttendance(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_HCM.query(
        `select setting_value from param_hcm where setting_name ='AKTIF JENIS ABSEN'`,
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            // eslint-disable-next-line eqeqeq
            if (results.rows[0].setting_value == 0) {
              pool.db_MMFPROD.query(
                `SELECT count(*) FROM emp_clocking_detail_tbl 
                where employee_id = $1 and (absence_wage in 
                ('CT_A_BPTIS','CT_A_NIKAH','CT_GUGUR','CT_HAJI','CT_I_LAHIR','CT_KLG_WFT',
                'CT_LAHIR','CT_NIKAH','CT_RMH_WFT','CT_THN','CT_SKT','IJ_SAKIT') or 
                note like '%Travel Request%') and clocking_date =current_date
                  `,
                [employee_id],
                (error, results) => {
                  if (error) throw error;

                  // eslint-disable-next-line eqeqeq
                  if (results.rows != '') {
                    if (results.rows[0].count > 0) {
                      response.status(200).send({
                        status: 200,
                        message: 'Berhasil Clock In dan Clock Out',
                        validate_id: employee_id,
                        data: 3,
                      });
                    } else {
                      pool.db_MMFPROD.query(
                        ` with x as ( 
                          SELECT to_char(clocking_date,'yyyy-mm-dd') clocking_date ,to_char(time_in ,'HH:MI') as time_in  ,to_char(time_out ,'HH:MI') as time_out 
                          FROM emp_clocking_detail_tbl where clocking_date =date'2021-04-02' and employee_id = $1 
                          and  (absence_wage not in ('CT_A_BPTIS','CT_A_NIKAH','CT_GUGUR','CT_HAJI','CT_I_LAHIR','CT_KLG_WFT',
                                                 'CT_LAHIR','CT_NIKAH','CT_RMH_WFT','CT_THN','CT_SKT','IJ_SAKIT') or 
                                                  note not like '%Travel Request')
                          union all 
                          select to_char(clocking_date,'yyyy-mm-dd') clocking_date ,
                          max(case when in_out='0' then to_char(clocking_date,'HH:MI')  else null end) as time_in,
                          max(case when in_out='1' then to_char(clocking_date,'HH:MI')  else null end) as time_out
                          from emp_clocking_temp_tbl where employee_id = $1
                          and TO_CHAR(clocking_date,'YYYY-MM-DD') =to_char(current_date,'YYYY-MM-DD')
                          group by to_char(clocking_date,'yyyy-mm-dd') 
                          ) select *
                          from x `,
                        [employee_id],
                        (error, results) => {
                          if (error) throw error;

                          // eslint-disable-next-line eqeqeq
                          if (results.rows != '') {
                            if (
                              // eslint-disable-next-line operator-linebreak
                              // eslint-disable-next-line eqeqeq
                              results.rows[0].time_in != '' &&
                              results.rows[0].time_in != null
                            ) {
                              if (
                                // eslint-disable-next-line operator-linebreak
                                // eslint-disable-next-line eqeqeq
                                results.rows[0].time_out != '' &&
                                results.rows[0].time_out != null
                              ) {
                                response.status(200).send({
                                  status: 200,
                                  message: 'Berhasil Clock In dan Clock Out',
                                  validate_id: employee_id,
                                  data: 2,
                                });
                              } else {
                                response.status(200).send({
                                  status: 200,
                                  message:
                                    'Berhasil Clock In dan Belum Clock Out',
                                  validate_id: employee_id,
                                  data: 1,
                                });
                              }
                            } else {
                              response.status(200).send({
                                status: 200,
                                message:
                                  'Belum melakukan clock in dan clock out',
                                validate_id: employee_id,
                                data: 0,
                              });
                            }
                          } else {
                            response.status(200).send({
                              status: 200,
                              message: 'Belum melakukan clock in dan clock out',
                              validate_id: employee_id,
                              data: 0,
                            });
                          }
                        }
                      );
                    }
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
              // eslint-disable-next-line eqeqeq
            } else if (results.rows[0].setting_value == 1) {
              response.status(200).send({
                status: 200,
                message: 'Belum melakukan clock in dan clock out',
                validate_id: employee_id,
                data: 0,
              });
              // eslint-disable-next-line eqeqeq
            } else if (results.rows[0].setting_value == 2) {
              response.status(200).send({
                status: 200,
                message: 'Berhasil Clock In dan Belum Clock Out',
                validate_id: employee_id,
                data: 1,
              });
            }
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
