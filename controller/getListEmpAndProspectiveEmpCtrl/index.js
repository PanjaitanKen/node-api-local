const pool = require('../../db');
const { validationResult } = require('express-validator');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getListEmpAndProspectiveEmp(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    try {
      const { employee_id, login_type } = request.body;

      pool.db_MMFPROD.query(
        `select a.applicant_id, coalesce(a.first_name,'')||coalesce(a.last_name,'') as nama_karyawan,
        to_char(b.starting_date,'YYYY-MM-DD') as  tgl_kerja, q.internal_title as ket_jabatan,
        to_char(a.date_of_birth ,'YYYY-MM-DD') as  tgl_lahir,n.contact_value as no_hp_ck, o.contact_value as email_ck,
        ' ' qr_code,'KARYAWAN' as status
        from applicant_tbl a
        left join candidate_appointment_tbl b on a.applicant_id = b.candidate_id
        left join applicant_contact_info_tbl n on a.applicant_id = n.applicant_id and n.default_address ='Y' and n.contact_type='3' 
        left join applicant_contact_info_tbl o on a.applicant_id = o.applicant_id and o.default_address ='Y' and o.contact_type='4'
        left join applicant_applied_pos_tbl p on a.applicant_id = p.applicant_id 
        left join position_tbl q on p.position_id = q.position_id 
        where new_assign_employee is not null
        and b.new_sup_emp =$1  and current_date between appointment_date and starting_date`,
        [employee_id],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            const mmf_data = results.rows[0];
            pool.db_HCM.query(
              `select a.applicant_id,  coalesce(a.nama_depan ,'')||coalesce(a.nama_belakang,'') as nama_karyawan,
              to_char(a.tgl_kerja,'YYYY-MM-DD') as  tgl_kerja, a.position_id as ket_jabatan,
              to_char(a.tgl_lahir ,'YYYY-MM-DD') as  tgl_lahir, a.no_hp_ck, a.email_ck,
              a.userid_ck||'-'||to_char(a.tgl_lahir ,'DDMMYYYY') ||'-'||right("password",10) as qr_code,
              'CALON KARYAWAN' as status
              from trx_calon_karyawan a  
              where nokar_atasan = $1 and 
              tgl_scan_qr is null`,
              [employee_id],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rows != '') {
                  response.status(200).send({
                    status: 200,
                    message: 'Load Data berhasil',
                    validate_id: employee_id,
                    data1: mmf_data,
                    data2: results.rows[0],
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
