const pool = require('../../db');

const { URL } = process.env;

const controller = {
  index(request, response) {
    const {
      params: { category, slug },
    } = request;

    const query = `${URL}/${category}/${slug}`;

    try {
      pool.db_HCM.query(
        'SELECT kategori_berita, tgl_input, ket_header, deskripsi, tgl_event_dr, tgl_event_sd, lokasi, images FROM trx_berita WHERE url_webview = $1',
        [query],
        (_, results) => {
          if (results.rows.length > 0) {
            const { ket_header } = results.rows[0];

            response.render('webview', {
              title: `${ket_header} - Mandala`,
              data: results.rows[0],
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
};

module.exports = controller;
