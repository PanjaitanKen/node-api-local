const pool = require('../../db');
// Tabel : travel_request_tbl, travel_request_destination_tbl
const controller = {
  getListMenu_Doc(request, response) {
    try {
      const { employee_id, grade_id, position_id } = request.body;

      pool.db_HCM.query(
        ' with x as (select group_dok ,no_urut_group ,id_dok ,sub_dok ,nama_dok , keterangan , url_image from mas_dokumen ' +
          " where employee_id ='ALL' and grade_id ='ALL' and position_id ='ALL' and  " +
          ' (tgl_laku is  null or tgl_laku<=current_date ) ' +
          ' union all ' +
          ' select group_dok ,no_urut_group ,id_dok , sub_dok ,nama_dok , keterangan , url_dok from   ' +
          ' (select * from mas_dokumen ' +
          " where employee_id <>'ALL' or grade_id <>'ALL' or position_id <>'ALL' " +
          ' order by no_urut_group asc ' +
          ' ) x ' +
          ' where (EMPLOYEE_ID = $1 or grade_id = $2 or position_id = $3) and  ' +
          ' (tgl_laku is  null or tgl_laku<=current_date )  ' +
          " ) select * from x where id_dok ='0' " +
          ' order by no_urut_group asc ',
        [employee_id, grade_id, position_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            let respData = results.rows;

            const groupDoks = respData
              .map((val) => `'${val.group_dok}'`)
              .toString();

            pool.db_HCM.query(
              `with x as (select group_dok ,no_urut_group ,sub_dok ,id_dok ,nama_dok , keterangan , url_dok, shareable from mas_dokumen
                where employee_id ='ALL' and grade_id ='ALL' and position_id ='ALL' and 
                (tgl_laku is  null or tgl_laku<=current_date )
                union all
                select group_dok ,no_urut_group ,sub_dok ,id_dok ,nama_dok , keterangan , url_dok, shareable from  
                (select * from mas_dokumen
                where employee_id <>'ALL' or grade_id <>'ALL' or position_id <>'ALL'
                order by no_urut_group asc
                ) x
                where (EMPLOYEE_ID = $1 or grade_id= $2 or position_id= $3) and 
                (tgl_laku is  null or tgl_laku<=current_date ) 
                ) select * from x where id_dok <>'0' 
                and group_dok in (${groupDoks})     
                order by no_urut_group asc
                `,
              [employee_id, grade_id, position_id],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rows != '') {
                  const respData2 = results.rows;

                  respData = respData.reduce(
                    (_, currentRespData, __, arrayRespData) => {
                      // eslint-disable-next-line no-param-reassign
                      currentRespData.data_detail = respData2.filter(
                        (val) => val.group_dok === currentRespData.group_dok
                      );

                      return arrayRespData;
                    },
                    []
                  );

                  response.status(200).send({
                    status: 200,
                    message: 'Load Data berhasil',
                    data: respData,
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
