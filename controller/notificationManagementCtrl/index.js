// Tabel : temp_notif
const { validationResult } = require('express-validator');
const pool = require('../../db');

const controller = {
  insert(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      body: { employee_id, jenis, ket1, ket2, nobukti, golid, approved_date },
    } = request;

    try {
      pool.db_HCM.query(
        `insert into temp_notif (employee_id ,jenis , ket1 ,ket2 ,nobukti , golid , approved_date ,sudah_baca )
        values ($1 ,$2,$3,$4,$5,$6,$7,null)`,
        [employee_id, jenis, ket1, ket2, nobukti, golid, approved_date],
        (error, results) => {
          if (error) throw error;

          response.status(201).send({
            status: 'SUCCESS',
            message: 'Notification succes insert to table',
            data: '',
          });
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  countTempNotif(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id } = request.body;

    try {
      pool.db_HCM.query(
        `select count(*) from temp_notif where
        employee_id =$1 and sudah_baca is null
        and approved_date between (current_date -interval '1 days' * 20) and now()`,
        [employee_id],
        (error, results) => {
          if (error) throw error;

          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: employee_id,
              data: results.rows[0],
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
    } catch (error) {
      response.status(500).send(error);
    }
  },
  listTempNotif(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id } = request.body;
    try {
      pool.db_HCM.query(
        `select a.employee_id, a.jenis, a.ket1, a.ket2, a.nobukti, a.golid, a.approved_Date, a.sudah_baca,
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
        and approved_date between (current_date -interval '1 days' * 20) and now()`,
        [employee_id],
        (error, results) => {
          if (error) throw error;

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
              data: '',
            });
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  updateTempNotif(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, golid } = request.body;

    try {
      pool.db_HCM.query(
        `select sudah_baca from temp_notif where employee_id = $1 and golid = $2`,
        [employee_id, golid],
        (error, results) => {
          if (error) throw error;

          if (results.rows[0].sudah_baca == null) {
            pool.db_HCM.query(
              `update temp_notif set sudah_baca=current_date where employee_id =$1
              and sudah_baca is null and golid=$2 `,
              [employee_id, golid],
              (error, results) => {
                if (error) throw error;

                response.status(202).send({
                  status: 'SUCCESS UPDATE',
                  message: 'Notification succes update to table',
                  data: '',
                });
              }
            );
          } else {
            response.status(200).send({
              status: 'UPDATE FAILED',
              message: 'Notification data already set',
              data: '',
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
