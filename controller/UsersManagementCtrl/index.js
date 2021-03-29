// Tabel : sys_mmenu, sys_muserid_d, sys_muserid_h
const { validationResult } = require('express-validator');
const pool = require('../../db');

const controller = {
  login(request, response) {
    const {
      body: { username, password },
    } = request;

    try {
      pool.db_HCM.query(
        'SELECT userid, nmuser FROM sys_muserid_h WHERE (employee_code = $1 OR userid = $1) AND password = $2',
        [username, password],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            response.status(200).send({
              status: 'SUCCESS',
              message: 'LOGIN SUCCESS',
              data: {
                token: `${results.rows[0].userid}-${
                  results.rows[0].nmuser
                }-${Math.random().toString(36).slice(2)}`,
              },
            });
          } else {
            response.status(500).send({
              status: 'FAILED',
              message: 'LOGIN FAILED',
              data: [],
            });
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  getUserHasMenus(request, response) {
    const { userid } = request.params;

    try {
      pool.db_HCM.query(
        'SELECT * FROM sys_muserid_d WHERE userid = $1',
        [userid],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            response.status(200).send({
              status: 'SUCCESS',
              message: 'GET USER HAS MENU',
              data: results.rows,
            });
          } else {
            response.status(500).send({
              status: 'ERROR',
              message: 'USER HAS MENU NOT FOUND',
              data: [],
            });
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  manageUserMenus(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      body: { user, menus },
    } = request;

    const menusToArrayObject = menus.map((value) => {
      const splitValue = value.split('-');
      const kdsys = splitValue[0];
      const nourut = splitValue[1];
      const gprg = splitValue[2];
      const sprg = splitValue[3];
      const nprg = splitValue[4];
      const permission = splitValue[5];

      return {
        kdsys,
        nourut,
        gprg,
        sprg,
        nprg,
        permission,
      };
    });

    const menuDatas = [];

    menusToArrayObject.forEach((item) => {
      const existing = menuDatas.filter((v) => v.nprg === item.nprg);

      if (existing.length > 0) {
        const existingIndex = menuDatas.indexOf(existing[0]);

        menuDatas[existingIndex].permission = menuDatas[
          existingIndex
        ].permission.concat(',', item.permission);
      } else menuDatas.push(item);
    });

    try {
      pool.db_HCM.query(
        'SELECT userid FROM sys_muserid_d WHERE userid = $1',
        [user],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            pool.db_HCM.query(
              'DELETE FROM sys_muserid_d WHERE userid = $1',
              [user],
              (error) => {
                if (error) throw error;
              }
            );
          }

          menuDatas.forEach((value) => {
            const hakses = /hakses/.test(value.permission) ? 1 : 0;
            const tambah = /tambah/.test(value.permission) ? 1 : 0;
            const ubah = /ubah/.test(value.permission) ? 1 : 0;
            const hapus = /hapus/.test(value.permission) ? 1 : 0;
            const cetak = /cetak/.test(value.permission) ? 1 : 0;

            pool.db_HCM.query(
              `INSERT INTO sys_muserid_d (
                  kdpt, userid, kdsys, nourut, gprg, sprg, nprg, hakses, tambah, ubah, hapus, cetak
                ) VALUES (
                  'MFIN', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
                )`,
              [
                user,
                value.kdsys,
                value.nourut,
                value.gprg,
                value.sprg,
                value.nprg,
                hakses,
                tambah,
                ubah,
                hapus,
                cetak,
              ],
              (error) => {
                if (error) throw error;
              }
            );
          });

          response.status(201).send({
            status: 'SUCCESS',
            message: 'MANAGE USER',
            data: '',
          });
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
  getSystemMasterMenu(_, response) {
    try {
      pool.db_HCM.query(
        'SELECT * FROM sys_mmenu ORDER BY nourut ASC',
        (error, results) => {
          if (error) throw error;

          response.status(200).send({
            status: 'SUCCESS',
            message: 'GET ALL SYSTEM MASTER MENU',
            data: results.rows,
          });
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
  insertSystemMasterMenu(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      // eslint-disable-next-line object-curly-newline
      body: { kdsys, nourut, gprg, sprg, nprg, mode, tgllaku },
    } = request;

    try {
      pool.db_HCM.query(
        `INSERT INTO sys_mmenu (kdpt, kdsys, nourut, gprg, sprg, nprg, mode, tgllaku)
          VALUES ('MFIN', $1, $2, $3, $4, $5, $6, $7)`,
        [kdsys, nourut, gprg, sprg, nprg, mode, tgllaku],
        (error) => {
          if (error) throw error;

          response.status(201).send({
            status: 'SUCCESS',
            message: 'INSERT SYSTEM MASTER MENU',
            data: '',
          });
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  getUsers(_, response) {
    try {
      pool.db_HCM.query(
        'SELECT kdpt, employee_code, userid, nmuser, tglaku FROM sys_muserid_h ORDER BY employee_code DESC',
        (error, results) => {
          if (error) throw error;

          response.status(200).send({
            status: 'SUCCESS',
            message: 'GET ALL USERS',
            data: results.rows,
          });
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
  showUsers(request, response) {
    const { employee_code } = request.params;

    try {
      pool.db_HCM.query(
        'SELECT kdpt, employee_code, userid, nmuser, tglaku FROM sys_muserid_h WHERE employee_code = $1',
        [employee_code],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            response.status(200).send({
              status: 'SUCCESS',
              message: 'GET USER BY ID',
              data: results.rows[0],
            });
          } else {
            response.status(500).send({
              status: 'ERROR',
              message: 'USER NOT FOUND',
              data: [],
            });
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  insertUsers(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      // eslint-disable-next-line object-curly-newline
      body: { employee_code, userid, nmuser, password, tglaku },
    } = request;

    try {
      pool.db_HCM.query(
        `INSERT INTO sys_muserid_h (kdpt, employee_code, userid, nmuser, password, tglaku)
          VALUES ('MFIN', $1, $2, $3, $4, $5)`,
        [employee_code, userid, nmuser, password, tglaku],
        (error) => {
          if (error) throw error;

          response.status(201).send({
            status: 'SUCCESS',
            message: 'INSERT USER',
            data: '',
          });
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  updateUsers(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const {
      // eslint-disable-next-line object-curly-newline
      body: { employee_code, userid, nmuser, password, tglaku },
    } = request;

    try {
      pool.db_HCM.query(
        'SELECT password FROM sys_muserid_h WHERE employee_code = $1',
        [employee_code],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            pool.db_HCM.query(
              'UPDATE sys_muserid_h SET userid = $2, nmuser = $3, password = $4, tglaku = $5 WHERE employee_code = $1',
              [
                employee_code,
                userid,
                nmuser,
                password || results.rows[0].password,
                tglaku,
              ],
              (error) => {
                if (error) throw error;

                response.status(200).send({
                  status: 'SUCCESS',
                  message: 'UPDATE USER',
                  data: '',
                });
              }
            );
          } else {
            response.status(500).send({
              status: false,
              message: 'EMPLOYEE_CODE NOT FOUND',
              data: [],
            });
          }
        }
      );
    } catch (error) {
      response.status(500).send(error);
    }
  },
  deleteUsers(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_code } = request.body;

    try {
      pool.db_HCM.query(
        'SELECT employee_code FROM sys_muserid_h WHERE employee_code = $1',
        [employee_code],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            pool.db_HCM.query(
              'DELETE FROM sys_muserid_h WHERE employee_code = $1',
              [employee_code],
              (error, results) => {
                if (error) throw error;

                response.status(200).send({
                  status: 'SUCCESS',
                  message: 'DELETE USER',
                  data: results.rows,
                });
              }
            );
          } else {
            response.status(500).send({
              status: 'FAILED',
              message: 'EMPLOYEE_CODE NOT FOUND',
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
