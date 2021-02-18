// Tabel: HCM.mas_kategori_komplain
const { validationResult } = require('express-validator');

const pool = require('../../db');

const controller = {
  index(_, response) {
    try {
      pool.db_HCM.query(
        'SELECT * FROM mas_kategori_komplain ORDER BY id_kategori_komplain DESC',
        (error, results) => {
          if (error) throw error;

          if (results.rows != '') {
            response.status(200).send({
              status: true,
              message: 'GET ALL CATEGORY COMPLAINT',
              data: results.rows,
            });
          } else {
            response.status(500).send({
              status: true,
              message: 'CATEGORY COMPLAINT NOT FOUND',
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
        'SELECT * FROM mas_kategori_komplain WHERE id_kategori_komplain = $1',
        [id],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            response.status(200).send({
              status: true,
              message: 'GET CATEGORY COMPLAINT BY ID',
              data: results.rows[0],
            });
          } else {
            response.status(500).send({
              status: false,
              message: 'ID KATEGORI KOMPLAIN NOT FOUND',
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

    const {
      ket_kategori,
      email_to,
      cc_to,
      subject_email,
      no_hp,
    } = request.body;

    try {
      pool.db_HCM.query(
        'INSERT INTO mas_kategori_komplain (ket_kategori, email_to, cc_to, subject_email, no_hp) VALUES ($1, $2, $3, $4, $5)',
        [ket_kategori, email_to, cc_to, subject_email, no_hp],
        (error, results) => {
          if (error) throw error;

          response.status(201).send({
            status: true,
            message: 'INSERT CATEGORY COMPLAINT',
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

    const {
      id_kategori_komplain,
      ket_kategori,
      email_to,
      cc_to,
      subject_email,
      no_hp,
    } = request.body;

    try {
      pool.db_HCM.query(
        'SELECT id_kategori_komplain FROM mas_kategori_komplain WHERE id_kategori_komplain = $1',
        [id_kategori_komplain],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            pool.db_HCM.query(
              'UPDATE mas_kategori_komplain SET ket_kategori = $2, email_to = $3, cc_to = $4, subject_email = $5, no_hp = $6 WHERE id_kategori_komplain = $1',
              [
                id_kategori_komplain,
                ket_kategori,
                email_to,
                cc_to,
                subject_email,
                no_hp,
              ],
              (error, results) => {
                if (error) throw error;

                response.status(200).send({
                  status: true,
                  message: 'UPDATE CATEGORY COMPLAINT',
                  data: results.rows,
                });
              }
            );
          } else {
            response.status(500).send({
              status: false,
              message: 'ID KATEGORI KOMPLAIN NOT FOUND',
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

    const { id_kategori_komplain } = request.body;

    try {
      pool.db_HCM.query(
        'SELECT id_kategori_komplain FROM mas_kategori_komplain WHERE id_kategori_komplain = $1',
        [id_kategori_komplain],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            pool.db_HCM.query(
              'DELETE FROM mas_kategori_komplain WHERE id_kategori_komplain = $1',
              [id_kategori_komplain],
              (error, results) => {
                if (error) throw error;

                response.status(200).send({
                  status: true,
                  message: 'DELETE CATEGORY COMPLAINT',
                  data: results.rows,
                });
              }
            );
          } else {
            response.status(500).send({
              status: false,
              message: 'ID KATEGORI KOMPLAIN NOT FOUND',
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
