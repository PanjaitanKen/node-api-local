const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getProspectiveEmployees(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_HCM.query(
        `select nourut,applicant_id ,state ,nama_depan ,nama_belakang , tgl_input,
        tgl_penunjukan, tgl_kerja, tempat_rekrut , tempat_lahir ,tgl_lahir ,punya_anak , 
        alamat, prop_alamat ,kodepos_alamat ,kota_alamat ,gol_darah ,marital_status ,
        jenis_kelamin ,employee_id ,company_office ,no_hp_ck ,email_ck ,recruitment_officer_id ,
        nama_recruiter ,no_hp_recruiter ,email_recruiter ,nokar_atasan ,nama_atasan ,
        nokar_mentor ,nama_mentor , grade_id , org_id , 
        noktp , npwp_no , kode_bank, rek_bank_cabang, norek, an_rek,
        userid_ck
        from trx_calon_karyawan
        where userid_ck=$1`,
        [employee_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
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
              data: results.rows,
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
