const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : trx_calon_karyawan
const controller = {
  login(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    try {
      const usernameRequest = request.body.username;
      const passwordRequest = request.body.password;

      pool.db_HCM.query(
        "SELECT userid_ck, to_char(tgl_kerja ,'DDMMYYYY') as tgl_kerja, password, nama_depan, nama_belakang FROM trx_calon_karyawan WHERE userid_ck = $1 and tgl_scan_qr is null ",
        [usernameRequest],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount !== 0) {
            const { password } = results.rows[0];
            const passwordDecrypt = Helpers.decrypt(password);

            if (passwordDecrypt === passwordRequest) {
              response.status(200).send({
                status: 200,
                message: 'Login Berhasil',
                data: results.rows[0],
              });
            } else {
              response.status(401).send({
                status: 401,
                message: 'Password yang di input salah',
                data: null,
              });
            }
          } else {
            response.status(401).send({
              status: 401,
              message: 'User ID yang di input salah atau User ID sudah tidak Valid ',
              data: null,
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
