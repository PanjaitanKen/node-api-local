const pool = require('../../db');
const { validationResult } = require('express-validator');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getFirstDayGuideData(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    try {
      const { employee_id } = request.body;

      pool.db_HCM.query(
        `select to_char(tgl_kerja,'MM/DD/YYYY') tgl_kerja,
        to_char(tgl_kerja,'DD')||' '||
                  case when to_char(tgl_kerja ,'MM')='01' then 'Januari'
                    when to_char(tgl_kerja,'MM')='02' then 'Febuari'
                    when to_char(tgl_kerja,'MM')='03' then 'Maret'
                    when to_char(tgl_kerja,'MM')='04' then 'April'
                    when to_char(tgl_kerja,'MM')='05' then 'Mei'
                    when to_char(tgl_kerja,'MM')='06' then 'Juni'
                    when to_char(tgl_kerja,'MM')='07' then 'Juli'
                    when to_char(tgl_kerja,'MM')='08' then 'Agustus'
                    when to_char(tgl_kerja,'MM')='09' then 'September'
                    when to_char(tgl_kerja,'MM')='10' then 'Oktober'
                    when to_char(tgl_kerja,'MM')='11' then 'November'
                    when to_char(tgl_kerja,'MM')='12' then 'Desember' end ||' '||to_char(tgl_kerja,'YYYY') tgl_kerja2,
        company_office, nama_atasan
        from trx_calon_karyawan
        where userid_ck=$1`,
        [employee_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            // eslint-disable-next-line prefer-const
            let rawData = results.rows[0];
            pool.db_MMFPROD.query(
              `select  initcap(address) alamat 
              from work_location_tbl where work_location =$1`,
              [rawData.company_office],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rows != '') {
                  rawData.company_office = results.rows[0].alamat;
                  response.status(200).send({
                    status: 200,
                    message: 'Load Data berhasil',
                    validate_id: employee_id,
                    data: rawData,
                  });
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
