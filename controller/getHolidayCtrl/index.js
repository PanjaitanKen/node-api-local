const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : day_sub_detail_tbl
const controller = {
  getHoliday(_, response) {
    Helpers.logger('SUCCESS', {}, 'getHolidayCtrl.getHoliday');

    try {
      pool.db_MMFPROD.query(
        'with X as ( ' +
          " select to_char(substitute_date,'YYYY-MM-DD') as tgl_libur , " +
          ' true as status_libur ' +
          ' from day_sub_detail_tbl ' +
          ' union all ' +
          " SELECT  to_char(cast( mydate as date),'YYYY-MM-DD') as sunday, true as status_libur FROM " +
          " generate_series(to_date((select min(to_char(substitute_date,'YYYY')) min_thn from day_sub_detail_tbl) ||'-01-01','YYYY-MM-DD'),  " +
          "  to_date((select max(to_char(substitute_date,'YYYY')) max_thn from day_sub_detail_tbl)||'-12-31','YYYY-MM-DD'), '1 day') AS g(mydate) " +
          ' WHERE EXTRACT(DOW FROM mydate) = 0 ' +
          ' ) select  * from X ' +
          ' order by tgl_libur desc ',
        (error, results) => {
          if (error) {
            Helpers.logger('ERROR', {}, 'getHolidayCtrl.getHoliday', error);
            throw error;
          }

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: results.rows,
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
      Helpers.logger('ERROR', {}, 'getHolidayCtrl.getHoliday', err);
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
