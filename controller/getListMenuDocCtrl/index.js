const pool = require('../../db');
const axios = require('axios');

// Tabel : travel_request_tbl, travel_request_destination_tbl
const controller = {
  getListMenu_Doc(request, response) {
    try {
      const { employee_id, grade_id, position_id } = request.body;

      //insert log activity user -- start
      const data = {
        employee_id: employee_id,
        menu: 'Informasi Untukmu',
      };

      const options = {
        headers: {
          'Content-Type': 'application/json',
          API_KEY: process.env.API_KEY,
        },
      };

      axios
        .post(process.env.URL + '/hcm/api/addLogUser', data, options)
        .then((res) => {
          console.log('RESPONSE ==== : ', res.data);
        })
        .catch((err) => {
          console.log('ERROR: ====', err);
        });
      //insert log activity user -- end

      pool.db_HCM.query(
        ' with x as  ' +
          ' (select employee_id, grade_id, position_id, tgl_expired, b.group_dok , b.no_urut_group , b.sub_dok , b.id_dok , b.nama_dok , b.keterangan , b.url_dok, b.shareable, b.url_image  ' +
          ' from mas_dokumen a ' +
          ' left join mas_menu_dokumen b on a.no_urut_group=b.no_urut_group and a.sub_dok=b.sub_dok and a.id_dok =b.id_dok  ' +
          " where a.employee_id ='ALL' and a.grade_id ='ALL' and a.position_id ='ALL' and " +
          ' (b.tgl_expired is  null or b.tgl_expired<=current_date ) ' +
          ' union all ' +
          ' select employee_id, grade_id, position_id, tgl_expired, group_dok ,no_urut_group ,sub_dok ,id_dok ,nama_dok , keterangan , url_dok, shareable, url_image ' +
          ' from  ' +
          ' (select a.employee_id ,a.grade_id ,a.position_id ,b.tgl_expired ,b.group_dok , b.no_urut_group , b.sub_dok , b.id_dok , ' +
          ' b.nama_dok , b.keterangan , b.url_dok, b.shareable, b.url_image  ' +
          ' from mas_dokumen a ' +
          ' left join mas_menu_dokumen b on a.no_urut_group=b.no_urut_group and a.sub_dok=b.sub_dok and a.id_dok = b.id_dok ' +
          " where a.employee_id <>'ALL' or a.grade_id <>'ALL' or a.position_id <>'ALL' " +
          ' and  (b.tgl_expired is  null or b.tgl_expired<=current_date ) ' +
          ' order by no_urut_group asc ' +
          ' ) x ' +
          ' where  (EMPLOYEE_ID = $1 or grade_id= $2 or position_id= $3) and   ' +
          '  (x.tgl_expired is  null or x.tgl_expired<=current_date ) ' +
          " ) select * from x where id_dok ='0' " +
          ' order by no_urut_group asc',
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
              `with x as 
              (select employee_id, grade_id, position_id, tgl_expired, b.group_dok , b.no_urut_group , b.sub_dok , b.id_dok , b.nama_dok , b.keterangan , b.url_dok, b.shareable 
                              from mas_dokumen a
                              left join mas_menu_dokumen b on a.no_urut_group=b.no_urut_group and a.sub_dok=b.sub_dok and a.id_dok =b.id_dok 
                              where a.employee_id ='ALL' and a.grade_id ='ALL' and a.position_id ='ALL' and 
                              (b.tgl_expired is  null or b.tgl_expired<=current_date )
                              union all
                              select employee_id, grade_id, position_id, tgl_expired, group_dok ,no_urut_group ,sub_dok ,id_dok ,nama_dok , keterangan , url_dok, shareable 
                                   from  
                                   (select a.employee_id ,a.grade_id ,a.position_id ,b.tgl_expired ,b.group_dok , b.no_urut_group , b.sub_dok , b.id_dok , 
                                    b.nama_dok , b.keterangan , b.url_dok, b.shareable  
                                   from mas_dokumen a
                                   left join mas_menu_dokumen b on a.no_urut_group=b.no_urut_group and a.sub_dok=b.sub_dok and a.id_dok = b.id_dok 
                                   where a.employee_id <>'ALL' or a.grade_id <>'ALL' or a.position_id <>'ALL'
                                   and  (b.tgl_expired is  null or b.tgl_expired<=current_date )
                                   order by no_urut_group asc
                               ) x
                              where  (EMPLOYEE_ID = $1 or grade_id= $2 or position_id= $3) and  
                                     (x.tgl_expired is  null or x.tgl_expired<=current_date ) 
                              ) select * from x where id_dok <>'0' 
                              and group_dok in (${groupDoks})   
                              order by no_urut_group,sub_dok,id_dok asc `,
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
