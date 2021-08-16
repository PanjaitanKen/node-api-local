const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : mas_photo_profile
const controller = {
  getURLPhotoProfile(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id } = request.body;

    Helpers.logger(
      'SUCCESS',
      {
        employee_id,
      },
      'getURLPhotoProfileCtrl.getURLPhotoProfile'
    );

    try {
      pool.db_HCM.query(
        `select url_photo from mas_photo_profile where employee_id = $1 `,
        [employee_id],
        (error, results) => {
          if (error) {
            Helpers.logger(
              'ERROR',
              {
                employee_id,
              },
              'getURLPhotoProfileCtrl.getURLPhotoProfile',
              error
            );

            throw error;
          }

          // eslint-disable-next-line eqeqeq
          if (results.rows != 0) {
            response.status(200).send({
              status: 200,
              message: 'Load Data Success',
              validate_id: employee_id,
              data: results.rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Not Found',
              validate_id: employee_id,
              data: {
                url_photo: ' ',
              },
            });
          }
        }
      );
    } catch (err) {
      Helpers.logger(
        'ERROR',
        {
          employee_id,
        },
        'getURLPhotoProfileCtrl.getURLPhotoProfile',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
