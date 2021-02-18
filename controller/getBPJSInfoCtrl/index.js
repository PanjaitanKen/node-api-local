const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getBPJS_Info(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_MMFPROD.query(
        `select c.employee_id,  a.display_name as nama, bpjsk_no ,bpjsk_join_date as tgl_bergabung_bpjsk,
          a.faskes_code,b.faskes_name ,b.faskes_type, kelas_rawat
          from person_tbl a
          left join faskes_tbl b on a.faskes_code =b.faskes_code
          left join employee_tbl c on a.person_id =c.person_id
          where c.employee_id = $1
          `,
        [employee_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
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
