/* eslint-disable object-curly-newline */
/* eslint-disable eqeqeq */

// Tabel : temp_notif
const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

const controller = {
  async insert(request, response) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json(Helpers.dataResponse(422, errors));
    }

    const {
      body: { employee_id, jenis, ket1, ket2, nobukti, golid, approved_date },
    } = request;

    Helpers.logger(
      'SUCCESS',
      { employee_id, jenis, ket1, ket2, nobukti, golid, approved_date },
      'notificationManagementCtrl.insert'
    );

    try {
      const query =
        'select * from temp_notif where employee_id = $1 and golid =$2 and jenis =$3';

      await pool.db_HCM
        .query(query, [employee_id, golid, jenis])
        .then(async ({ rows }) => {
          if (rows != '') {
            response
              .status(200)
              .json(Helpers.dataResponse(200, rows, employee_id));
          } else {
            await pool.db_HCM
              .query(
                `insert into temp_notif (employee_id ,jenis , ket1 ,ket2 ,nobukti , golid , approved_date ,sudah_baca )
              values ($1 ,$2,$3,$4,$5,$6,$7,null)`,
                [employee_id, jenis, ket1, ket2, nobukti, golid, approved_date]
              )
              .then(() => {
                response
                  .status(201)
                  .json(Helpers.dataResponse(201, 'CREATED', employee_id));
              })
              .catch((error) => {
                throw error;
              });
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      Helpers.logger(
        'ERROR',
        { employee_id, jenis, ket1, ket2, nobukti, golid, approved_date },
        'notificationManagementCtrl.insert',
        error.message
      );

      response.status(500).json(Helpers.dataResponse(500, []));
    }
  },
  async countTempNotif(request, response) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json(Helpers.dataResponse(422, errors));
    }

    const { employee_id } = request.body;

    Helpers.logger(
      'SUCCESS',
      { employee_id },
      'notificationManagementCtrl.countTempNotif'
    );

    try {
      const query = `select count(*) from temp_notif where
        employee_id =$1 and sudah_baca is null
        and approved_date between (current_date -interval '1 days' * 20) and now()`;

      await pool.db_HCM
        .query(query, [employee_id])
        .then(({ rows }) => {
          if (rows != '') {
            response
              .status(200)
              .json(Helpers.dataResponse(200, rows[0], employee_id));
          } else {
            response
              .status(404)
              .json(Helpers.dataResponse(404, {}, employee_id));
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      Helpers.logger(
        'ERROR',
        { employee_id },
        'notificationManagementCtrl.countTempNotif',
        error.message
      );

      response.status(500).json(Helpers.dataResponse(500, []));
    }
  },
  async listTempNotif(request, response) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json(Helpers.dataResponse(422, errors));
    }

    const { employee_id } = request.body;

    Helpers.logger(
      'SUCCESS',
      { employee_id },
      'notificationManagementCtrl.listTempNotif'
    );

    try {
      const query = `select a.employee_id, a.jenis, a.ket1, a.ket2, a.nobukti, a.golid, a.approved_Date, a.sudah_baca,
        case  when current_date-a.approved_date=0 then 'Hari ini'
                            when current_date-a.approved_date=1 then 'Kemarin'
                            when current_date-a.approved_date=2 then '2 Hari yang lalu'
                            when current_date-a.approved_date=3 then '3 Hari yang lalu'
                            when current_date-a.approved_date=4 then '4 Hari yang lalu'
                            when current_date-a.approved_date=5 then '5 Hari yang lalu'
                            when current_date-a.approved_date=6 then '6 Hari yang lalu'
                            when current_date-a.approved_date=7 then '7 Hari yang lalu'
                            when current_date-a.approved_date>7 then to_char(a.approved_date,'DD Mon YYYY') 
        end as Durasi_Waktu                   
        from temp_notif a 
        where
        employee_id =$1 
        and approved_date between (current_date -interval '1 days' * 20) and now() order by a.nourut_notif desc `;

      await pool.db_HCM
        .query(query, [employee_id])
        .then(({ rows }) => {
          if (rows != '') {
            response
              .status(200)
              .json(Helpers.dataResponse(200, rows, employee_id));
          } else {
            response
              .status(404)
              .json(Helpers.dataResponse(404, [], employee_id));
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      Helpers.logger(
        'ERROR',
        { employee_id },
        'notificationManagementCtrl.listTempNotif',
        error.message
      );

      response.status(500).json(Helpers.dataResponse(500, []));
    }
  },
  async updateTempNotif(request, response) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json(Helpers.dataResponse(422, errors));
    }

    const { employee_id, golid } = request.body;

    Helpers.logger(
      'SUCCESS',
      { employee_id, golid },
      'notificationManagementCtrl.updateTempNotif'
    );

    try {
      const query =
        'select sudah_baca from temp_notif where employee_id = $1 and golid = $2';

      await pool.db_HCM
        .query(query, [employee_id, golid])
        .then(async ({ rows }) => {
          if (rows != '') {
            if (rows[0].sudah_baca == null) {
              await pool.db_HCM
                .query(
                  `update temp_notif set sudah_baca=current_date where employee_id =$1
              and sudah_baca is null and golid=$2 `,
                  [employee_id, golid]
                )
                .then(() => {
                  response
                    .status(201)
                    .json(Helpers.dataResponse(201, 'UPDATED', employee_id));
                })
                .catch((error) => {
                  throw error;
                });
            } else {
              response
                .status(200)
                .json(
                  Helpers.dataResponse(
                    200,
                    'NOTIFICATION DATA ALREADY SET',
                    employee_id
                  )
                );
            }
          } else {
            response
              .status(404)
              .json(
                Helpers.dataResponse(
                  404,
                  'employee_id OR golid_id',
                  employee_id
                )
              );
          }
        });
    } catch (error) {
      Helpers.logger(
        'ERROR',
        { employee_id, golid },
        'notificationManagementCtrl.updateTempNotif',
        error.message
      );

      response.status(500).json(Helpers.dataResponse(500, []));
    }
  },
  async getTrxPushNotif(_, response) {
    try {
      const { rowCount, rows } = await pool.db_HCM.query(
        'SELECT * FROM trx_push_notif ORDER BY tanggal, tgl_push_notif DESC'
      );

      if (rowCount > 0) {
        response.status(200).send({
          status: 200,
          message: 'SUCCESS',
          data: rows,
        });
      } else {
        response.status(404).send({
          status: 404,
          message: 'NOT FOUND',
          data: [],
        });
      }
    } catch (error) {
      response.status(500).send(error);
    }
  },
  async showTrxPushNotif(request, response) {
    const {
      params: { id },
    } = request;

    try {
      const { rowCount, rows } = await pool.db_HCM.query(
        'SELECT judul, isi, tanggal FROM trx_push_notif WHERE id_push_notif = $1',
        [id]
      );

      if (rowCount > 0) {
        response.status(200).send({
          status: 200,
          message: 'SUCCESS',
          data: rows[0],
        });
      } else {
        response.status(404).send({
          status: 404,
          message: 'NOT FOUND',
          data: {},
        });
      }
    } catch (error) {
      response.status(500).send(error);
    }
  },
  async insertTrxPushNotif(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      body: { judul, isi, tanggal },
    } = request;

    try {
      await pool.db_HCM
        .query(
          'INSERT INTO trx_push_notif (judul, isi, tanggal, tgl_push_notif) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
          [judul, isi, tanggal]
        )
        .then(() => {
          response.status(201).send({
            status: 201,
            message: 'CREATED',
            data: { judul, isi, tanggal },
          });
        });
    } catch (error) {
      response.status(500).send(error);
    }
  },
  async updateTrxPushNotif(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      body: { id_push_notif, judul, isi, tanggal },
    } = request;

    try {
      const { rowCount } = await pool.db_HCM.query(
        'SELECT id_push_notif FROM trx_push_notif WHERE id_push_notif = $1',
        [id_push_notif]
      );

      if (rowCount > 0) {
        await pool.db_HCM
          .query(
            'UPDATE trx_push_notif SET judul = $2, isi = $3, tanggal = $4 WHERE id_push_notif = $1',
            [id_push_notif, judul, isi, tanggal]
          )
          .then(() => {
            response.status(200).send({
              status: 200,
              message: 'UPDATED',
              data: { id_push_notif, judul, isi, tanggal },
            });
          });
      } else {
        response.status(404).send({
          status: 404,
          message: 'NOT FOUND',
          data: {},
        });
      }
    } catch (error) {
      response.status(500).send(error);
    }
  },
  async deleteTrxPushNotif(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      body: { id_push_notif },
    } = request;

    try {
      const { rowCount } = await pool.db_HCM.query(
        'SELECT id_push_notif FROM trx_push_notif WHERE id_push_notif = $1',
        [id_push_notif]
      );

      if (rowCount > 0) {
        await pool.db_HCM
          .query('DELETE FROM trx_push_notif WHERE id_push_notif = $1', [
            id_push_notif,
          ])
          .then(() => {
            response.status(200).send({
              status: 200,
              message: 'DELETED',
              data: id_push_notif,
            });
          });
      } else {
        response.status(404).send({
          status: 404,
          message: 'NOT FOUND',
          data: {},
        });
      }
    } catch (error) {
      response.status(500).send(error);
    }
  },
};

module.exports = controller;
