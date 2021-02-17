const pool = require('../../db');

// Tabel : session_tracking_tbl
const controller = {
  checkTokenOrange(request, response) {
    try {
      const { employee_id, session_id } = request.body;

      pool.db_MMFPROD.query(
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
          ') x',
        [employee_id, session_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          if (results.rows !== '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: results.rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
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
