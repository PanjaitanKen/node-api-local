const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  async getListHelpInfo(request, response) {
    try {
      const query =
        'select DISTINCT ON (title) title,judul from mas_info_bantuan';

      await pool.db_HCM
        .query(query)
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            const data1 = rows;
            for (let i = 0; i < data1.length; i++) {
              pool.db_HCM
                .query(
                  `select url_assets ,width,height
                from mas_info_bantuan 
                where title = $1`,
                  [data1[i].title]
                )

                .then(async ({ rows }) => {
                  if (rows != 0) {
                    data1[i].docImage = rows;
                    console.log(data1);
                  } else {
                    console.log('gamasuk');
                  }
                });
            }
            await pool.db_HCM
              .query(
                'select DISTINCT ON (title) title,judul from mas_info_bantuan'
              )
              .then(async () => {
                response.status(200).send({
                  status: 200,
                  message: 'Load Data berhasil',
                  data: data1,
                });
              })
              .catch((error) => {
                throw error;
              });

            // console.log(data1);
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              data: '',
            });
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
