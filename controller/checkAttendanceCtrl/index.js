const pool = require('../../db');

// Tabel : employeeworkofftbl, leaverequest_tbl
const controller = {
  checkAttendance(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_MMFPROD.query(
        'SELECT time_in FROM emp_clocking_detail_tbl where clocking_date =current_date and employee_id = $1',
        [employee_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '' && results.rows != undefined) {
            if (
              // eslint-disable-next-line operator-linebreak
              // eslint-disable-next-line eqeqeq
              results.rows[0].time_in != '' &&
              results.rows[0].time_in != null
            ) {
              pool.db_MMFPROD.query(
                'SELECT time_out FROM emp_clocking_detail_tbl where clocking_date =current_date and employee_id = $1',
                [employee_id],
                (error, results) => {
                  if (error) throw error;

                  if (
                    // eslint-disable-next-line operator-linebreak
                    // eslint-disable-next-line eqeqeq
                    results.rows[0].time_out != '' &&
                    results.rows[0].time_out != null
                  ) {
                    console.log('a');
                    pool.db_MMFPROD.query(
                      `SELECT count(*) FROM emp_clocking_detail_tbl 
                      where employee_id = $1 and absence_wage in 
                       ('CT_A_BPTIS','CT_A_NIKAH','CT_GUGUR','CT_HAJI','CT_I_LAHIR','CT_KLG_WFT',
                      'CT_LAHIR','CT_NIKAH','CT_RMH_WFT','CT_THN','CT_SKT') and clocking_date =current_date`,
                      [employee_id],
                      (error, results) => {
                        if (error) throw error;

                        if (
                          // eslint-disable-next-line operator-linebreak
                          // eslint-disable-next-line eqeqeq
                          results.rows[0].count == '1'
                        ) {
                          response.status(200).send({
                            status: 200,
                            message: 'Berhasil Clock In dan Clock Out',
                            validate_id: employee_id,
                            data: 3,
                          });
                        } else {
                          response.status(200).send({
                            status: 200,
                            message: 'Berhasil Clock In dan Clock Out',
                            validate_id: employee_id,
                            data: 2,
                          });
                        }
                      }
                    );
                  } else {
                    console.log('b');
                    pool.db_MMFPROD.query(
                      `select to_char(clocking_date,'HH:MI') as time_out from emp_clocking_temp_tbl where employee_id = $1
                      and in_out = '1' and TO_CHAR(clocking_date,'YYYY-MM-DD') =to_char(current_date,'YYYY-MM-DD')
                      order by clocking_date desc`,
                      [employee_id],
                      (error, results) => {
                        if (error) throw error;
                        console.log(results.rows);
                        console.log(employee_id);
                        if (results.rows != '' && results.rows != undefined) {
                          if (
                            // eslint-disable-next-line operator-linebreak
                            // eslint-disable-next-line eqeqeq
                            results.rows[0].time_out != '' &&
                            results.rows[0].time_out != null
                          ) {
                            console.log('c');
                            pool.db_MMFPROD.query(
                              `SELECT count(*) FROM emp_clocking_detail_tbl 
                            where employee_id = $1 and absence_wage in 
                             ('CT_A_BPTIS','CT_A_NIKAH','CT_GUGUR','CT_HAJI','CT_I_LAHIR','CT_KLG_WFT',
                            'CT_LAHIR','CT_NIKAH','CT_RMH_WFT','CT_THN','CT_SKT') and clocking_date =current_date`,
                              [employee_id],
                              (error, results) => {
                                if (error) throw error;

                                if (
                                  // eslint-disable-next-line operator-linebreak
                                  // eslint-disable-next-line eqeqeq
                                  results.rows[0].count == '1'
                                ) {
                                  response.status(200).send({
                                    status: 200,
                                    message: 'Berhasil Clock In dan Clock Out',
                                    validate_id: employee_id,
                                    data: 3,
                                  });
                                } else {
                                  response.status(200).send({
                                    status: 200,
                                    message: 'Berhasil Clock In dan Clock Out',
                                    validate_id: employee_id,
                                    data: 2,
                                  });
                                }
                              }
                            );
                          } else {
                            console.log('d');
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
                            message: 'Berhasil Clock In dan Belum Clock Out',
                            validate_id: employee_id,
                            data: 1,
                          });
                        }
                      }
                    );
                  }
                }
              );
            } else {
              response.status(200).send({
                status: 200,
                message: 'Belum Melakukan Clock In dan Clock Out',
                validate_id: employee_id,
                data: 0,
              });
            }
          } else {
            pool.db_MMFPROD.query(
              `select to_char(clocking_date,'HH:MI') as time_in from emp_clocking_temp_tbl where employee_id = $1  
              and in_out = '0' and TO_CHAR(clocking_date,'YYYY-MM-DD') =to_char(current_date,'YYYY-MM-DD')
              order by clocking_date desc`,
              [employee_id],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rows != '' && results.rows != undefined) {
                  if (
                    // eslint-disable-next-line operator-linebreak
                    // eslint-disable-next-line eqeqeq
                    results.rows[0].time_in != '' &&
                    results.rows[0].time_in != null
                  ) {
                    pool.db_MMFPROD.query(
                      'SELECT time_out FROM emp_clocking_detail_tbl where clocking_date =current_date and employee_id = $1',
                      [employee_id],
                      (error, results) => {
                        if (error) throw error;

                        if (
                          // eslint-disable-next-line operator-linebreak
                          // eslint-disable-next-line eqeqeq
                          results.rows[0].time_out != '' &&
                          results.rows[0].time_out != null
                        ) {
                          pool.db_MMFPROD.query(
                            `SELECT count(*) FROM emp_clocking_detail_tbl 
                            where employee_id = $1 and absence_wage in 
                             ('CT_A_BPTIS','CT_A_NIKAH','CT_GUGUR','CT_HAJI','CT_I_LAHIR','CT_KLG_WFT',
                            'CT_LAHIR','CT_NIKAH','CT_RMH_WFT','CT_THN','CT_SKT') and clocking_date =current_date`,
                            [employee_id],
                            (error, results) => {
                              if (error) throw error;

                              if (
                                // eslint-disable-next-line operator-linebreak
                                // eslint-disable-next-line eqeqeq
                                results.rows[0].count == '1'
                              ) {
                                response.status(200).send({
                                  status: 200,
                                  message: 'Berhasil Clock In dan Clock Out',
                                  validate_id: employee_id,
                                  data: 3,
                                });
                              } else {
                                response.status(200).send({
                                  status: 200,
                                  message: 'Berhasil Clock In dan Clock Out',
                                  validate_id: employee_id,
                                  data: 2,
                                });
                              }
                            }
                          );
                        } else {
                          pool.db_MMFPROD.query(
                            `select to_char(clocking_date,'HH:MI') as time_out from emp_clocking_temp_tbl where employee_id = $1
                            and in_out = '1' and TO_CHAR(clocking_date,'YYYY-MM-DD') =to_char(current_date,'YYYY-MM-DD')
                            order by clocking_date desc`,
                            [employee_id],
                            (error, results) => {
                              if (error) throw error;
                              if (
                                results.rows != '' &&
                                results.rows != undefined
                              ) {
                                if (
                                  // eslint-disable-next-line operator-linebreak
                                  // eslint-disable-next-line eqeqeq
                                  results.rows[0].time_out != '' &&
                                  results.rows[0].time_out != null
                                ) {
                                  pool.db_MMFPROD.query(
                                    `SELECT count(*) FROM emp_clocking_detail_tbl 
                                  where employee_id = $1 and absence_wage in 
                                   ('CT_A_BPTIS','CT_A_NIKAH','CT_GUGUR','CT_HAJI','CT_I_LAHIR','CT_KLG_WFT',
                                  'CT_LAHIR','CT_NIKAH','CT_RMH_WFT','CT_THN','CT_SKT') and clocking_date =current_date`,
                                    [employee_id],
                                    (error, results) => {
                                      if (error) throw error;

                                      if (
                                        // eslint-disable-next-line operator-linebreak
                                        // eslint-disable-next-line eqeqeq
                                        results.rows[0].count == '1'
                                      ) {
                                        response.status(200).send({
                                          status: 200,
                                          message:
                                            'Berhasil Clock In dan Clock Out',
                                          validate_id: employee_id,
                                          data: 3,
                                        });
                                      } else {
                                        response.status(200).send({
                                          status: 200,
                                          message:
                                            'Berhasil Clock In dan Clock Out',
                                          validate_id: employee_id,
                                          data: 2,
                                        });
                                      }
                                    }
                                  );
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
                                    'Berhasil Clock In dan Belum Clock Out',
                                  validate_id: employee_id,
                                  data: 1,
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  } else {
                    response.status(200).send({
                      status: 200,
                      message: 'Belum Melakukan Clock In dan Clock Out',
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
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
