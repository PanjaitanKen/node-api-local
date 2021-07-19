/* eslint-disable no-unused-expressions */
// Tabel : trx_berita
const fs = require('fs');
const dateFormat = require('dateformat');
const { isArray } = require('lodash');
const { validationResult } = require('express-validator');

const pool = require('../../db');
const Helpers = require('../../helpers');

const { URL } = process.env;

const controller = {
  index(request, response) {
    const {
      query: { limit },
    } = request;

    Helpers.logger('SUCCESS', { limit }, 'NewsCtrl.index');

    try {
      if (limit) {
        pool.db_HCM.query(
          ' SELECT berita_id,kategori_berita,' +
            " to_char(tgl_input,'DD')||' '|| " +
            " case when to_char(tgl_input,'MM')='01' then 'Jan' " +
            " when to_char(tgl_input,'MM')='02' then 'Feb' " +
            " when to_char(tgl_input,'MM')='03' then 'Mar' " +
            " when to_char(tgl_input,'MM')='04' then 'Apr' " +
            " when to_char(tgl_input,'MM')='05' then 'Mei' " +
            " when to_char(tgl_input,'MM')='06' then 'Jun' " +
            " when to_char(tgl_input,'MM')='07' then 'Jul' " +
            " when to_char(tgl_input,'MM')='08' then 'Ags' " +
            " when to_char(tgl_input,'MM')='09' then 'Sep' " +
            " when to_char(tgl_input,'MM')='10' then 'Okt' " +
            " when to_char(tgl_input,'MM')='11' then 'Nov' " +
            " when to_char(tgl_input,'MM')='12' then 'Des' end ||' '||to_char(tgl_input,'YYYY')||', '||to_char(tgl_input,'HH24:MI')||' WIB' as tgl_input,  " +
            ' ket_header, deskripsi, tgl_event_dr ,tgl_event_sd , ' +
            ' lokasi, url_webview, tgl_expired,images ' +
            ' FROM trx_berita ORDER BY tgl_input DESC ' +
            ' LIMIT $1 ',
          [limit],
          (error, results) => {
            if (error) {
              Helpers.logger('ERROR', { limit }, 'NewsCtrl.index', error);
              throw error;
            }

            if (results.rows !== '') {
              response.status(200).send({
                status: 200,
                message: 'GET ALL NEWS',
                data: results.rows,
              });
            } else {
              response.status(500).send({
                status: 500,
                message: 'NEWS NOT FOUND',
                data: [],
              });
            }
          }
        );
      } else {
        pool.db_HCM.query(
          'SELECT * FROM trx_berita ORDER BY berita_id DESC',
          (error, results) => {
            if (error) {
              Helpers.logger('ERROR', { limit }, 'NewsCtrl.index', error);
              throw error;
            }

            if (results.rows !== '') {
              response.status(200).send({
                status: 200,
                message: 'GET ALL NEWS',
                data: results.rows,
              });
            } else {
              response.status(500).send({
                status: 500,
                message: 'NEWS NOT FOUND',
                data: [],
              });
            }
          }
        );
      }
    } catch (err) {
      Helpers.logger('ERROR', { limit }, 'NewsCtrl.index', err);
      response.status(500).send(err);
    }
  },
  show(request, response) {
    const { id } = request.params;

    try {
      pool.db_HCM.query(
        'SELECT * FROM trx_berita WHERE berita_id = $1',
        [id],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            response.status(200).send({
              status: 200,
              message: 'GET NEWS BY ID',
              data: results.rows[0],
            });
          } else {
            response.status(500).send({
              status: 500,
              message: 'NEWS NOT FOUND',
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
      body: {
        kategori_berita,
        ket_header,
        deskripsi,
        tgl_event_dr,
        tgl_event_sd,
        lokasi,
        tgl_expired,
      },
      files: { images, pdfs },
    } = request;

    const url_images = [];
    const url_pdfs = [];

    const url_webview = `${URL}/${kategori_berita}/${ket_header
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')}`;

    try {
      // Handling upload file
      const dir = './uploads/news';

      const fileName = `mandala-${kategori_berita}-${dateFormat(
        new Date(),
        'ddmmyyyyhhMMss'
      )}`;

      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      if (isArray(images)) {
        images.forEach((val, id) => {
          const { data, mimetype } = val;
          const fileExtension = mimetype.split('/')[1];

          url_images.push(
            `${URL}/uploads/news/${fileName}-${id}.${fileExtension}`
          );

          fs.writeFile(
            `${dir}/${fileName}-${id}.${fileExtension}`,
            data,
            (error) => {
              if (error) throw error;
            }
          );
        });
      } else {
        const { data, mimetype } = images;
        const fileExtension = mimetype.split('/')[1];

        url_images.push(`${URL}/uploads/news/${fileName}.${fileExtension}`);

        fs.writeFile(`${dir}/${fileName}.${fileExtension}`, data, (error) => {
          if (error) throw error;
        });
      }

      if (isArray(pdfs)) {
        pdfs.forEach((val, id) => {
          const { data, mimetype } = val;
          const fileExtension = mimetype.split('/')[1];

          url_pdfs.push(
            `${URL}/uploads/news/${fileName}-${id}.${fileExtension}`
          );

          fs.writeFile(
            `${dir}/${fileName}-${id}.${fileExtension}`,
            data,
            (error) => {
              if (error) throw error;
            }
          );
        });
      } else {
        const { data, mimetype } = pdfs;
        const fileExtension = mimetype.split('/')[1];

        url_pdfs.push(`${URL}/uploads/news/${fileName}.${fileExtension}`);

        fs.writeFile(`${dir}/${fileName}.${fileExtension}`, data, (error) => {
          if (error) throw error;
        });
      }

      // Handling query
      pool.db_HCM.query(
        `
        INSERT INTO trx_berita (kategori_berita,
          tgl_input, ket_header, deskripsi, tgl_event_dr, tgl_event_sd,
          lokasi, url_webview, tgl_expired, images, deskripsi_pdf)
        VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          kategori_berita,
          ket_header,
          deskripsi,
          tgl_event_dr,
          tgl_event_sd,
          lokasi,
          url_webview,
          tgl_expired,
          JSON.stringify(url_images),
          JSON.stringify(url_pdfs),
        ],
        (error) => {
          if (error) throw error;

          response.status(201).send({
            status: 201,
            message: 'INSERT NEWS',
            data: '',
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
      body: {
        berita_id,
        kategori_berita,
        ket_header,
        deskripsi,
        tgl_event_dr,
        tgl_event_sd,
        lokasi,
        tgl_expired,
      },
      files,
    } = request;

    const images = files && files.images;
    const pdfs = files && files.pdfs;

    const url_images = [];
    const url_pdfs = [];

    const url_webview = `${URL}/${kategori_berita}/${ket_header
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')}`;

    try {
      // Handling upload file
      const dir = './uploads/news';

      const fileName = `mandala-${kategori_berita}-${dateFormat(
        new Date(),
        'ddmmyyyyhhMMss'
      )}`;

      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      if (images) {
        if (isArray(images)) {
          images.forEach((val, id) => {
            const { data, mimetype } = val;
            const fileExtension = mimetype.split('/')[1];

            url_images.push(
              `${URL}/uploads/news/${fileName}-${id}.${fileExtension}`
            );

            fs.writeFile(
              `${dir}/${fileName}-${id}.${fileExtension}`,
              data,
              (error) => {
                if (error) throw error;
              }
            );
          });
        } else {
          const { data, mimetype } = images;
          const fileExtension = mimetype.split('/')[1];

          url_images.push(`${URL}/uploads/news/${fileName}.${fileExtension}`);

          fs.writeFile(`${dir}/${fileName}.${fileExtension}`, data, (error) => {
            if (error) throw error;
          });
        }
      }

      if (pdfs) {
        if (isArray(pdfs)) {
          pdfs.forEach((val, id) => {
            const { data, mimetype } = val;
            const fileExtension = mimetype.split('/')[1];

            url_pdfs.push(
              `${URL}/uploads/news/${fileName}-${id}.${fileExtension}`
            );

            fs.writeFile(
              `${dir}/${fileName}-${id}.${fileExtension}`,
              data,
              (error) => {
                if (error) throw error;
              }
            );
          });
        } else {
          const { data, mimetype } = pdfs;
          const fileExtension = mimetype.split('/')[1];

          url_pdfs.push(`${URL}/uploads/news/${fileName}.${fileExtension}`);

          fs.writeFile(`${dir}/${fileName}.${fileExtension}`, data, (error) => {
            if (error) throw error;
          });
        }
      }

      // Handling query
      pool.db_HCM.query(
        'SELECT images, deskripsi_pdf FROM trx_berita WHERE berita_id = $1',
        [berita_id],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            if (images) {
              // Delete the previous file
              results.rows[0].images &&
                results.rows[0].images.forEach((value) => {
                  const path = `./uploads/news/${
                    value.split('/').reverse().join('/').split('/')[0]
                  }`;

                  if (fs.existsSync(path)) fs.unlinkSync(path);
                });
            }

            if (pdfs) {
              // Delete the previous file
              results.rows[0].deskripsi_pdf &&
                results.rows[0].deskripsi_pdf.forEach((value) => {
                  const path = `./uploads/news/${
                    value.split('/').reverse().join('/').split('/')[0]
                  }`;

                  if (fs.existsSync(path)) fs.unlinkSync(path);
                });
            }

            pool.db_HCM.query(
              `UPDATE trx_berita SET kategori_berita = $2,
                tgl_input = CURRENT_TIMESTAMP, ket_header = $3, deskripsi = $4, tgl_event_dr = $5,
                tgl_event_sd = $6, lokasi = $7, url_webview = $8, tgl_expired = $9, images = $10, deskripsi_pdf = $11
                WHERE berita_id = $1`,
              [
                berita_id,
                kategori_berita,
                ket_header,
                deskripsi,
                tgl_event_dr,
                tgl_event_sd,
                lokasi,
                url_webview,
                tgl_expired,
                images
                  ? JSON.stringify(url_images)
                  : JSON.stringify(results.rows[0].images),
                pdfs
                  ? JSON.stringify(url_pdfs)
                  : JSON.stringify(results.rows[0].deskripsi_pdf),
              ],
              (error) => {
                if (error) throw error;

                response.status(200).send({
                  status: 200,
                  message: 'UPDATE NEWS',
                  data: results.rows,
                });
              }
            );
          } else {
            response.status(500).send({
              status: 500,
              message: 'BERITA ID NOT FOUND',
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

    const { berita_id } = request.body;

    try {
      pool.db_HCM.query(
        'SELECT berita_id, images, deskripsi_pdf FROM trx_berita WHERE berita_id = $1',
        [berita_id],
        (error, results) => {
          if (error) throw error;

          if (results.rowCount > 0) {
            results.rows[0].images &&
              results.rows[0].images.forEach((value) => {
                const path = `./uploads/news/${
                  value.split('/').reverse().join('/').split('/')[0]
                }`;

                if (fs.existsSync(path)) fs.unlinkSync(path);
              });

            results.rows[0].deskripsi_pdf &&
              results.rows[0].deskripsi_pdf.forEach((value) => {
                const path = `./uploads/news/${
                  value.split('/').reverse().join('/').split('/')[0]
                }`;

                if (fs.existsSync(path)) fs.unlinkSync(path);
              });

            pool.db_HCM.query(
              'DELETE FROM trx_berita WHERE berita_id = $1',
              [berita_id],
              (error, results) => {
                if (error) throw error;

                response.status(200).send({
                  status: 200,
                  message: 'DELETE NEWS',
                  data: results.rows,
                });
              }
            );
          } else {
            response.status(500).send({
              status: 500,
              message: 'BERITA ID NEWS NOT FOUND',
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
