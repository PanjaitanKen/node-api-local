// Tabel: HCM.param_hcm
const { validationResult } = require('express-validator');

const pool = require('../../db');

const controller = {
  index(_, response) {
    try {
      pool.db_HCM.query(
        'SELECT * FROM param_hcm ORDER BY param_id DESC',
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 'SUCCESS',
              message: 'GET ALL PARAM HCM',
              data: results.rows,
            });
          } else {
            response.status(404).send({
              status: 'FAILED',
              message: 'PARAM HCM NOT FOUND',
              data: [],
            });
          }
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
  show(request, response) {
    const { id } = request.params;

    try {
      pool.db_HCM.query(
        'SELECT * FROM param_hcm WHERE param_id = $1',
        [id],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            response.status(200).send({
              status: 'SUCCESS',
              message: 'GET PARAM HCM BY PARAM_ID',
              data: results.rows[0],
            });
          } else {
            response.status(404).send({
              status: 'FAILED',
              message: 'PARAM_ID NOT FOUND',
              data: [],
            });
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  store(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    const { setting_name, setting_value, description } = request.body;

    try {
      pool.db_HCM.query(
        'INSERT INTO param_hcm (setting_name, setting_value, description) VALUES ($1, $2, $3)',
        [setting_name, setting_value, description],
        (error, results) => {
          if (error) throw error;

          response.status(201).send({
            status: 'SUCCESS',
            message: 'INSERT PARAM HCM',
            data: results.rows,
          });
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  update(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    // eslint-disable-next-line object-curly-newline
    const { param_id, setting_name, setting_value, description } = request.body;

    try {
      pool.db_HCM.query(
        'SELECT param_id FROM param_hcm WHERE param_id = $1',
        [param_id],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            pool.db_HCM.query(
              'UPDATE param_hcm SET setting_name = $2, setting_value = $3, description = $4 WHERE param_id = $1',
              [param_id, setting_name, setting_value, description],
              (error, results) => {
                if (error) throw error;

                response.status(200).send({
                  status: 'SUCCESS',
                  message: 'UPDATE PARAM HCM',
                  data: results.rows,
                });
              }
            );
          } else {
            response.status(404).send({
              status: 'FAILED',
              message: 'PARAM_ID NOT FOUND',
              data: [],
            });
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  destroy(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { param_id } = request.body;

    try {
      pool.db_HCM.query(
        'SELECT param_id FROM param_hcm WHERE param_id = $1',
        [param_id],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            pool.db_HCM.query(
              'DELETE FROM param_hcm WHERE param_id = $1',
              [param_id],
              (error, results) => {
                if (error) throw error;

                response.status(200).send({
                  status: 'SUCCESS',
                  message: 'DELETE PARAM HCM',
                  data: results.rows,
                });
              }
            );
          } else {
            response.status(404).send({
              status: 'FAILED',
              message: 'PARAM_ID NOT FOUND',
              data: [],
            });
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
};

module.exports = controller;
