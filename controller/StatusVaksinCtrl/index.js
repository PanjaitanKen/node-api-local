// Tabel: hcm.mas_data_vaksin
const ExcelJS = require('exceljs');
const pool = require('../../db');

const controller = {
  async export(request, response) {
    try {
      const {
        body: { start_date, end_date },
      } = request;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Status Vaksin');

      worksheet.columns = [
        { header: 'No. Urut Vaksin', key: 'nourut_vaksin' },
        { header: 'Tanggal', key: 'tanggal' },
        { header: 'Nomor Karyawan', key: 'nokar' },
        { header: 'Nama Karyawan', key: 'nama_karyawan' },
        { header: 'Nama Posisi', key: 'nama_posisi' },
        { header: 'Kode Cabang Baru', key: 'kd_cabang_baru' },
        { header: 'Nama Cabang', key: 'nama_cabang' },
        { header: 'Wilayah', key: 'wilayah' },
        { header: 'Regional', key: 'regional' },
        { header: 'Sudah Vaksin', key: 'sudah_vaksin' },
        { header: 'Jumlah Anggota Keluarga', key: 'jumlah_anggota_keluarga' },
        { header: 'Jumlah Vaksin Anggota', key: 'jumlah_vaksin_anggota' },
      ];

      if (start_date && end_date) {
        const query = `
          select nourut_vaksin, to_char(tgl_update, 'DD/MM/YYYY') Tanggal, employee_id as Nokar,
            display_name as Nama_Karyawan, nama_posisi, pcx_kd_cabang as kd_Cabang_Baru, company_office as Nama_Cabang,
            pcx_wilayah as Wilayah, pcx_regional as Regional, Sudah_Vaksin, Jumlah_Anggota_Keluarga, jumlah_vaksin_anggota
          from mas_data_vaksin a
          where tgl_update between $1 and $2
          order by a.company_office asc, a.employee_id
        `;

        await pool.db_HCM
          .query(query, [start_date, end_date])
          .then(({ rowCount, rows }) => {
            if (rowCount > 0) {
              worksheet.addRows(rows);

              response.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              );

              workbook.xlsx.write(response).then(() => {
                response.status(200).end();
              });
            } else {
              response.status(404).send({
                status: 'FAILED',
                message: 'ALL FILTERED DATA NOT FOUND',
                data: [],
              });
            }
          })
          .catch((error) => {
            throw error;
          });
      } else {
        const query = `
          select nourut_vaksin, to_char(tgl_update, 'DD/MM/YYYY') Tanggal, employee_id as Nokar,
            display_name as Nama_Karyawan, nama_posisi, pcx_kd_cabang as kd_Cabang_Baru, company_office as Nama_Cabang,
            pcx_wilayah as Wilayah, pcx_regional as Regional, Sudah_Vaksin, Jumlah_Anggota_Keluarga, jumlah_vaksin_anggota
          from mas_data_vaksin a
          order by a.company_office asc, a.employee_id
        `;

        await pool.db_HCM
          .query(query)
          .then(({ rowCount, rows }) => {
            if (rowCount > 0) {
              worksheet.addRows(rows);

              response.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              );

              workbook.xlsx.write(response).then(() => {
                response.status(200).end();
              });
            } else {
              response.status(404).send({
                status: 'FAILED',
                message: 'ALL DATA NOT FOUND',
                data: [],
              });
            }
          })
          .catch((error) => {
            throw error;
          });
      }
    } catch (error) {
      response.status(500).send({
        status: 'ERROR',
        message: 'FATAL ERROR',
        data: error,
      });
    }
  },
};

module.exports = controller;
