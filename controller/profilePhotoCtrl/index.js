const fs = require('fs');
const pool = require('../../db');

const serve = process.env.URL;

// Tabel : emp_clocking_tbl, emp_clocking_detail_tbl, emp_clocking_temp_tbl
const controller = {
  profilePhoto(request, response) {
    try {
      const { employee_id, photo } = request.body;

      // get image from base64
      const base64Data = photo.replace(/^data:image\/png;base64,/, '');

      const dir = `./uploads/profile/${employee_id}/`;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      const fileName = `mportal-mandala-profile.jpg`;

      // eslint-disable-next-line global-require
      require('fs').writeFile(dir + fileName, base64Data, 'base64', () => {});
      const url_path = `${serve}/uploads/profile/${employee_id}/${fileName}`;

      pool.db_HCM.query(
        'select * from mas_photo_profile mpp where nokar =$1 ',
        [employee_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            pool.db_HCM.query(
              'update mas_photo_profile set url_photo =$2 WHERE nokar = $1',
              [employee_id, url_path],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rowCount != 0) {
                  response.status(201).send({
                    status: 202,
                    message: 'Update Success',
                    data: 2,
                  });
                } else {
                  response.status(201).send({
                    status: 200,
                    message: 'Update Failed',
                    data: 1,
                  });
                }
              }
            );
          } else {
            pool.db_HCM.query(
              'insert into mas_photo_profile (nokar, url_photo) values ($1, $2)',
              [employee_id, url_path],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rowCount != 0) {
                  response.status(201).send({
                    status: 201,
                    message: 'insert Success',
                    data: 2,
                  });
                } else {
                  response.status(201).send({
                    status: 201,
                    message: 'Insert failed',
                    data: 1,
                  });
                }
              }
            );
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
};

module.exports = controller;
