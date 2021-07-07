const oracledb = require('oracledb');

const user = process.env.ORACLE_DB_USER;
const password = process.env.ORACLE_DB_PASSWORD;
const connectString = process.env.ORACLE_DB_CONNECTSTRING;

const controller = {
  async checkAttendance(request, res) {
    try {
      connection = await oracledb.getConnection({
        user,
        password,
        connectString,
      });
      const { employee_id } = request.body;
      const day = new Date();
      const dayinhours = day.getHours();
      const clockInEnd = 11;
      // run query to get all employees
      const result = await connection.execute(
        `select nokar,TGL,
        max(case when tipe='DATANG' then jam else ' ' end) as jam_datang,
        max(case when tipe='PULANG' then jam else ' ' end) as jam_pulang
        from 
        (
            select 'DATANG' AS tipe, LTRIM(:employee_id, '0')   nokar, to_char(tgl,'YYYY-MM-DD') AS TGL,
            min(to_char(jam,'HH24:MI')) jam
            from trx_Absensi a
            where jenis='1' and nokar = LTRIM(:employee_id, '0')   and to_char(tgl,'YYYY-MM-DD')=to_char(current_date,'YYYY-MM-DD')
            group by LTRIM(:employee_id, '0')  ,to_char(tgl,'YYYY-MM-DD')
            union all
            select 'PULANG' AS tipe, LTRIM(:employee_id, '0')   nokar, to_char(tgl,'YYYY-MM-DD') AS TGL,
            max(to_char(jam,'HH24:MI')) jam
            from trx_Absensi a
            where jenis='2' and nokar = LTRIM(:employee_id, '0')  and to_char(tgl,'YYYY-MM-DD')=to_char(current_date,'YYYY-MM-DD')
            group by LTRIM(:employee_id, '0')  ,to_char(tgl,'YYYY-MM-DD')
        )
        group by nokar,tgl`,
        [employee_id]
      );

      if (connection) {
        try {
          // Always close connections
          await connection.close();
        } catch (err) {
          console.error(err.message);
        }
      }

      if (result.rows != 0) {
        if (result.rows[0][2] != 0 || dayinhours > clockInEnd) {
          if (result.rows[0][3] != 0) {
            res.status(200).send({
              status: 200,
              message: 'Berhasil Clock In & Clock Out',
              validate_id: employee_id,
              data: 2,
            });
          } else {
            res.status(200).send({
              status: 200,
              message: 'Berhasil Clock In & Belum Clock Out',
              validate_id: employee_id,
              data: 1,
            });
          }
        } else if (dayinhours > clockInEnd) {
          res.status(200).send({
            status: 200,
            message: 'Berhasil Clock In dan Belum Clock Out',
            validate_id: employee_id,
            data: 1,
          });
        } else {
          res.status(200).send({
            status: 200,
            message: 'Belum melakukan clock in dan clock out',
            validate_id: employee_id,
            data: 0,
          });
        }
      } else {
        // send all employees
        res.status(200).send({
          status: 200,
          message: 'Belum melakukan clock in & clock out',
          validate_id: employee_id,
          data: 0,
        });
      }
    } catch (err) {
      // send error message
      return res.send(err.message);
    }
  },
};

module.exports = controller;
