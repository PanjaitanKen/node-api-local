const { validationResult } = require('express-validator');
const axios = require('axios');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : trx_calon_karyawan
const controller = {
  index(_, response) {
    try {
      pool.db_HCM.query(
        `
        SELECT *,
          (CONCAT (nama_depan, ' ', nama_belakang)) AS nama_lengkap
        FROM trx_calon_karyawan
        ORDER BY tgl_input DESC
        `,
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            response.status(200).send({
              status: 'SUCCESS',
              message: 'GET ALL PROSPECTIVE EMPLOYEES',
              data: results.rows,
            });
          } else {
            response.status(404).send({
              status: 'FAILED',
              message: 'PROSPECTIVE EMPLOYEES NOT FOUND',
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
        'SELECT * FROM trx_calon_karyawan WHERE applicant_id = $1',
        [id],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            response.status(200).send({
              status: 'SUCCESS',
              message: 'GET PROSPECTIVE EMPLOYEE BY APPLICANT_ID',
              data: results.rows[0],
            });
          } else {
            response.status(404).send({
              status: 'FAILED',
              message: 'APPLICANT_ID NOT FOUND',
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
    const {
      applicant_id,
      state,
      nama_depan,
      nama_belakang,
      tgl_input,
      tgl_penunjukan,
      tgl_kerja,
      tempat_rekrut,
      tempat_lahir,
      tgl_lahir,
      punya_anak,
      alamat,
      prop_alamat,
      kodepos_alamat,
      kota_alamat,
      gol_darah,
      marital_status,
      jenis_kelamin,
      employee_id,
      company_office,
      no_hp_ck,
      email_ck,
      recruitment_officer_id,
      nama_recruiter,
      no_hp_recruiter,
      email_recruiter,
      nokar_atasan,
      nama_atasan,
      nokar_mentor,
      nama_mentor,
      grade_id,
      org_id,
      noktp,
      npwp_no,
      kode_bank,
      rek_bank_cabang,
      norek,
      an_rek,
      userid_ck,
      password,
      tgl_expired,
      tgl_scan_qr,
      position_id,
      nama_suami_istri,
      nama_ibu,
      nama_ayah,
      no_hp_atasan,
      email_atasan,
      jumlah_tanggungan_ck,
    } = request.body;

    try {
      pool.db_HCM.query(
        `INSERT INTO trx_calon_karyawan (
          applicant_id,
          state,
          nama_depan,
          nama_belakang,
          tgl_input,
          tgl_penunjukan,
          tgl_kerja,
          tempat_rekrut,
          tempat_lahir,
          tgl_lahir,
          punya_anak,
          alamat,
          prop_alamat,
          kodepos_alamat,
          kota_alamat,
          gol_darah,
          marital_status,
          jenis_kelamin,
          employee_id,
          company_office,
          no_hp_ck,
          email_ck,
          recruitment_officer_id,
          nama_recruiter,
          no_hp_recruiter,
          email_recruiter,
          nokar_atasan,
          nama_atasan,
          nokar_mentor,
          nama_mentor,
          grade_id,
          org_id,
          noktp,
          npwp_no,
          kode_bank,
          rek_bank_cabang,
          norek,
          an_rek,
          userid_ck,
          password,
          tgl_expired,
          tgl_scan_qr,
          position_id,
          nama_suami_istri,
          nama_ibu,
          nama_ayah,
          no_hp_atasan,
          email_atasan,
          jumlah_tanggungan_ck
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
          $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49
        )`,
        [
          applicant_id,
          state,
          nama_depan,
          nama_belakang,
          tgl_input || null,
          tgl_penunjukan || null,
          tgl_kerja || null,
          tempat_rekrut,
          tempat_lahir,
          tgl_lahir || null,
          punya_anak,
          alamat,
          prop_alamat,
          kodepos_alamat,
          kota_alamat,
          gol_darah,
          marital_status,
          jenis_kelamin,
          employee_id,
          company_office,
          no_hp_ck,
          email_ck,
          recruitment_officer_id,
          nama_recruiter,
          no_hp_recruiter,
          email_recruiter,
          nokar_atasan,
          nama_atasan,
          nokar_mentor,
          nama_mentor,
          grade_id,
          org_id,
          noktp,
          npwp_no,
          kode_bank,
          rek_bank_cabang,
          norek,
          an_rek,
          userid_ck,
          Helpers.encrypt(password),
          tgl_expired || null,
          tgl_scan_qr || null,
          position_id,
          nama_suami_istri,
          nama_ibu,
          nama_ayah,
          no_hp_atasan,
          email_atasan,
          jumlah_tanggungan_ck,
        ],
        (error, results) => {
          if (error) response.status(500).send(error);

          response.status(201).send({
            status: 'SUCCESS',
            message: 'INSERT PROSPECTIVE EMPLOYEE',
            data: results.rows,
          });
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  update(request, response) {
    const {
      applicant_id,
      state,
      nama_depan,
      nama_belakang,
      tgl_input,
      tgl_penunjukan,
      tgl_kerja,
      tempat_rekrut,
      tempat_lahir,
      tgl_lahir,
      punya_anak,
      alamat,
      prop_alamat,
      kodepos_alamat,
      kota_alamat,
      gol_darah,
      marital_status,
      jenis_kelamin,
      employee_id,
      company_office,
      no_hp_ck,
      email_ck,
      recruitment_officer_id,
      nama_recruiter,
      no_hp_recruiter,
      email_recruiter,
      nokar_atasan,
      nama_atasan,
      nokar_mentor,
      nama_mentor,
      grade_id,
      org_id,
      noktp,
      npwp_no,
      kode_bank,
      rek_bank_cabang,
      norek,
      an_rek,
      userid_ck,
      password,
      tgl_expired,
      tgl_scan_qr,
      position_id,
      nama_suami_istri,
      nama_ibu,
      nama_ayah,
      no_hp_atasan,
      email_atasan,
      jumlah_tanggungan_ck,
    } = request.body;

    try {
      pool.db_HCM.query(
        'SELECT password FROM trx_calon_karyawan WHERE applicant_id = $1',
        [applicant_id],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            const oldPassword = results.rows[0].password;

            pool.db_HCM.query(
              `UPDATE trx_calon_karyawan SET
                state = $2,
                nama_depan = $3,
                nama_belakang = $4,
                tgl_input = $5,
                tgl_penunjukan = $6,
                tgl_kerja = $7,
                tempat_rekrut = $8,
                tempat_lahir = $9,
                tgl_lahir = $10,
                punya_anak = $11,
                alamat = $12,
                prop_alamat = $13,
                kodepos_alamat = $14,
                kota_alamat = $15,
                gol_darah = $16,
                marital_status = $17,
                jenis_kelamin = $18,
                employee_id = $19,
                company_office = $20,
                no_hp_ck = $21,
                email_ck = $22,
                recruitment_officer_id = $23,
                nama_recruiter = $24,
                no_hp_recruiter = $25,
                email_recruiter = $26,
                nokar_atasan = $27,
                nama_atasan = $28,
                nokar_mentor = $29,
                nama_mentor = $30,
                grade_id = $31,
                org_id = $32,
                noktp = $33,
                npwp_no = $34,
                kode_bank = $35,
                rek_bank_cabang = $36,
                norek = $37,
                an_rek = $38,
                userid_ck = $39,
                password = $40,
                tgl_expired = $41,
                tgl_scan_qr = $42,
                position_id = $43,
                nama_suami_istri = $44,
                nama_ibu = $45,
                nama_ayah = $46,
                no_hp_atasan = $47,
                email_atasan = $48,
                jumlah_tanggungan_ck = $49
                WHERE applicant_id = $1`,
              [
                applicant_id,
                state,
                nama_depan,
                nama_belakang,
                tgl_input || null,
                tgl_penunjukan || null,
                tgl_kerja || null,
                tempat_rekrut,
                tempat_lahir,
                tgl_lahir || null,
                punya_anak,
                alamat,
                prop_alamat,
                kodepos_alamat,
                kota_alamat,
                gol_darah,
                marital_status,
                jenis_kelamin,
                employee_id,
                company_office,
                no_hp_ck,
                email_ck,
                recruitment_officer_id,
                nama_recruiter,
                no_hp_recruiter,
                email_recruiter,
                nokar_atasan,
                nama_atasan,
                nokar_mentor,
                nama_mentor,
                grade_id,
                org_id,
                noktp,
                npwp_no,
                kode_bank,
                rek_bank_cabang,
                norek,
                an_rek,
                userid_ck,
                password ? Helpers.encrypt(password) : oldPassword,
                tgl_expired || null,
                tgl_scan_qr || null,
                position_id,
                nama_suami_istri,
                nama_ibu,
                nama_ayah,
                no_hp_atasan,
                email_atasan,
                jumlah_tanggungan_ck,
              ],
              (error, results) => {
                if (error) response.status(500).send(error);

                response.status(200).send({
                  status: 'SUCCESS',
                  message: 'UPDATE PROSPECTIVE EMPLOYEE',
                  data: results.rows,
                });
              }
            );
          } else {
            response.status(404).send({
              status: 'FAILED',
              message: 'APPLICANT_ID NOT FOUND',
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

    const { applicant_id } = request.body;

    try {
      pool.db_HCM.query(
        'SELECT applicant_id FROM trx_calon_karyawan WHERE applicant_id = $1',
        [applicant_id],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            pool.db_HCM.query(
              'DELETE FROM trx_calon_karyawan WHERE applicant_id = $1',
              [applicant_id],
              (error, results) => {
                if (error) throw error;

                response.status(200).send({
                  status: 'SUCCESS',
                  message: 'DELETE PROSPECTIVE EMPLOYEE',
                  data: results.rows,
                });
              }
            );
          } else {
            response.status(404).send({
              status: 'FAILED',
              message: 'APPLICANT_ID NOT FOUND',
              data: [],
            });
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
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
              message:
                'Oops, nomor calon karyawan sudah tidak berlaku. Mohon masuk sebagai karyawan.',
              data: null,
            });
          }
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
  resendNotif(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    try {
      const {
        // eslint-disable-next-line object-curly-newline
        body: { category, applicant_id, no_hp_ck, email_ck },
      } = request;

      if (category !== 'WA' && category !== 'EMAIL') {
        response.status(400).send({
          status: 'FAILED',
          message: 'CATEGORY NOT VALID!',
          data: {},
        });
      } else {
        pool.db_HCM.query(
          'SELECT password FROM trx_calon_karyawan WHERE applicant_id = $1 AND (no_hp_ck = $2 OR email_ck = $3)',
          [applicant_id, no_hp_ck, email_ck],
          async (error, results) => {
            if (error) throw error;

            if (results.rowCount > 0) {
              const { password } = results.rows[0];

              if (category === 'WA') {
                axios
                  .post(
                    process.env.WA_SERVICE,
                    {
                      to: no_hp_ck,
                      header: 'Calon Karyawan PT Mandala Finance',
                      text: `Selamat bergabung di PT Mandala Finance, Tbk.\n\nSaat ini status anda adalah calon karyawan.\nSilahkan untuk mendownload aplikasi MPower by PT. Mandala Finance di playstore.\n\nCari dengan nama MPower - MFIN atau melalui link tautan ini https://play.google.com/store/apps/details?id=com.hcm.mandala\n\nAkses login MPower\nUser ID: ${applicant_id}\nPassword: ${Helpers.decrypt(
                        password
                      )}\n`,
                      text2: '*Human Resource PT Mandala Finance*',
                    },
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        API_KEY: process.env.API_KEY,
                      },
                    }
                  )
                  .then(() => {
                    response.status(200).send({
                      status: 'SUCCESS',
                      message: 'RESEND WA SUCCESS',
                      data: { category, applicant_id, no_hp_ck },
                    });
                  })
                  .catch((error) => {
                    throw error;
                  });
              } else if (category === 'EMAIL') {
                await Helpers.sendEmail(
                  'Calon Karyawan PT Mandala Finance',
                  `Selamat bergabung di PT Mandala Finance, Tbk.\n\nSaat ini status anda adalah calon karyawan.\nSilahkan untuk mendownload aplikasi MPower by PT. Mandala Finance di playstore.\n\nCari dengan nama MPower - MFIN atau melalui link tautan ini https://play.google.com/store/apps/details?id=com.hcm.mandala\n\nAkses login MPower\nUser ID: ${applicant_id}\nPassword: ${Helpers.decrypt(
                    password
                  )}\n\n*Human Resource PT Mandala Finance*`,
                  email_ck
                )
                  .then(() => {
                    response.status(200).send({
                      status: 'SUCCESS',
                      message: 'RESEND EMAIL SUCCESS',
                      data: { category, applicant_id, email_ck },
                    });
                  })
                  .catch((error) => {
                    throw error;
                  });
              }
            } else {
              response.status(404).send({
                status: 'FAILED',
                message: 'NO_HP_CK OR EMAIL_CK NOT FOUND!',
                data: {},
              });
            }
          }
        );
      }
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
