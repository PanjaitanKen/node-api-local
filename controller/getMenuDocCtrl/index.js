const pool = require('../../db');

// Tabel : travel_request_tbl, travel_request_destination_tbl
const controller = {
  getMenu_Doc(request, response) {
    try {
      const { employee_id, grade_id, position_id } = request.body;

      pool.db_HCM.query(
        `select group_dok ,no_urut_group ,sub_dok ,id_dok ,nama_dok , keterangan , url_dok from mas_dokumen
        where employee_id ='ALL' and grade_id ='ALL' and position_id ='ALL' and 
        (tgl_laku is  null or tgl_laku<=current_date )
        union all
        select group_dok ,no_urut_group ,sub_dok ,id_dok ,nama_dok , keterangan , url_dok from  
          (select * from mas_dokumen
          where employee_id <>'ALL' or grade_id <>'ALL' or position_id <>'ALL'
          order by no_urut_group asc
          ) x
        where (EMPLOYEE_ID = $1 or grade_id=$2 or position_id=$3) and 
        (tgl_laku is  null or tgl_laku<=current_date )`,
        [employee_id, grade_id, position_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: results.rows,
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
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
