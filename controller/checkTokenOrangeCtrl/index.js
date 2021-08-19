const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : session_tracking_tbl
const controller = {
  async checkTokenOrange(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, session_id } = request.body;

    Helpers.logger(
      'SUCCESS',
      { employee_id, session_id },
      'checkTokenOrangeCtrl.checkTokenOrange'
    );

    try {
      const query =
        'select case when count(*) = 0 ' +
        "then 'Session token anda telah berakhir, harap login ulang' " +
        "else 'session token masih aktif'   end as status_session,  " +
        "case when count(*) = 0  then '0' " +
        "else '1'  end as resp_session " +
        'from( ' +
        'select * from session_tracking_tbl  ' +
        'where user_id=$1  and session_id =$2 ' +
        'order by logon desc  ' +
        'limit 1  ' +
        ') x';

      await pool.db_MMFPROD
        .query(query, [employee_id, session_id])
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: employee_id,
              data: '',
            });
          }
        })
        .catch((error) => {
          Helpers.logger(
            'ERROR',
            { employee_id, session_id },
            'checkTokenOrangeCtrl.checkTokenOrange',
            error
          );
          throw error;
        });
    } catch (err) {
      Helpers.logger(
        'ERROR',
        { employee_id, session_id },
        'checkTokenOrangeCtrl.checkTokenOrange',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
