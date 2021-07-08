const dateFormat = require('dateformat');
const pool = require('../../db');

const { URL } = process.env;

const controller = {
  news(request, response) {
    const {
      params: { category, slug },
    } = request;

    const query = `${URL}/${category}/${slug}`;

    try {
      pool.db_HCM.query(
        'SELECT berita_id, kategori_berita, tgl_input, ket_header, deskripsi, tgl_event_dr, tgl_event_sd, lokasi, images FROM trx_berita WHERE url_webview = $1',
        [query],
        (_, results) => {
          if (results.rows.length > 0) {
            const { ket_header } = results.rows[0];

            const createdAt = `${dateFormat(
              results.rows[0].tgl_input,
              'dd mmm yyyy, HH:MM'
            )} WIB`;

            const tglEvent = `${dateFormat(
              results.rows[0].tgl_event_dr,
              'dd mmm yyyy, HH:MM'
            )} WIB s.d ${dateFormat(
              results.rows[0].tgl_event_sd,
              'dd mmm yyyy, HH:MM'
            )} WIB`;

            response.render('webview', {
              title: `${ket_header} - Mandala`,
              data: results.rows[0],
              createdAt,
              tglEvent,
            });
          } else {
            response.set('Content-Type', 'text/html');

            response.send(`
              <div style="max-width: 50vw; margin: 45vh auto;">
                <h1 style="text-align: center;">404</h1>
                <h2 style="text-align: center;">URL NOT FOUND</h2>
              </div>
            `);
          }
        }
      );
    } catch (_) {
      response.set('Content-Type', 'text/html');

      response.send(`
        <div style="max-width: 50vw; margin: 45vh auto;">
          <h1 style="text-align: center;">500</h1>
          <h2 style="text-align: center;">INTERNAL SERVER ERROR</h2>
        </div>
      `);
    }
  },
  documents(request, response) {
    const {
      params: { slug },
    } = request;

    switch (slug) {
      case 'komponen-fasilitas-kesehatan':
        response.render('documents/komponen_fasilitas_kesehatan', {
          title: 'Komponen Fasilitas Kesehatan - Mandala',
        });
        break;
      case 'komponen-fasilitas-kesehatan-staff':
        response.render('documents/komponen_fasilitas_kesehatan_staff', {
          title: 'Komponen Fasilitas Kesehatan Staff - Mandala',
        });
        break;
      case 'ketentuan-fasilitas-kesehatan':
        response.render('documents/ketentuan_fasilitas_kesehatan', {
          title: 'Ketentuan Fasilitas Kesehatan - Mandala',
        });
        break;
      case 'fasilitas-rawat-jalan':
        response.render('documents/fasilitas_rawat_jalan', {
          title: 'Fasilitas Rawat Jalan - Mandala',
        });
        break;
      case 'fasilitas-rawat-inap':
        response.render('documents/fasilitas_rawat_inap', {
          title: 'Fasilitas Rawat Inap - Mandala',
        });
        break;
      case 'fasilitas-kacamata':
        response.render('documents/fasilitas_kacamata', {
          title: 'Fasilitas Kacamata - Mandala',
        });
        break;
      case 'absensi':
        response.render('documents/absensi', {
          title: 'Absensi - Mandala',
        });
        break;
      case 'absensi-dan-hak-cuti':
        response.render('documents/absensi_dan_hak_cuti', {
          title: 'Absensi dan Hak Cuti - Mandala',
        });
        break;
      case 'cuti-dan-izin':
        response.render('documents/cuti_dan_izin', {
          title: 'Cuti dan Izin - Mandala',
        });
        break;
      // eslint-disable-next-line no-fallthrough
      default:
        response.set('Content-Type', 'text/html');

        response.send(`
          <div style="max-width: 50vw; margin: 45vh auto;">
            <h1 style="text-align: center;">404</h1>
            <h2 style="text-align: center;">URL NOT FOUND</h2>
          </div>
        `);
    }
  },
};

module.exports = controller;
