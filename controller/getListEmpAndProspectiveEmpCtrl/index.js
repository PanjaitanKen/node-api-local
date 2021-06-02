const pool = require('../../db');
const { validationResult } = require('express-validator');
const _ = require('lodash');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getListEmpAndProspectiveEmp(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    try {
      const { employee_id } = request.body;

      pool.db_MMFPROD.query(
        `select a.employee_id , c.display_name as nama_karyawan,
        to_char(first_join_date,'YYYY-MM-DD') as  tgl_kerja, e.internal_title as ket_jabatan,
        to_char(birth_Date,'YYYY-MM-DD') as  tgl_lahir,f.contact_value as no_hp_ck, g.contact_value as email_ck,
        ' ' qr_code,'KARYAWAN' as status
        from employee_supervisor_tbl a
        left join employee_tbl b on a.employee_id = b.employee_id 
        left join person_tbl c on b.person_id = c.person_id 
        left join employee_position_tbl d on b.employee_id = d.employee_id  and current_Date between d.valid_from and d.valid_to
        left join position_tbl e on d.position_id = e.position_id  
        left join person_contact_method_tbl f on c.person_id = f.person_id and f.contact_type ='3' and f.default_address ='Y'
        left join person_contact_method_tbl g on c.person_id = g.person_id and g.contact_type ='4' and f.default_address ='Y'
        where supervisor_id =$1 
        and current_date between a.valid_from and a.valid_to`,
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
              a.userid_ck||'-'||to_char(a.tgl_lahir ,'DDMMYYYY') ||'-'||"password" as qr_code,
              'CALON KARYAWAN' as status
              from trx_calon_karyawan a  
              where nokar_atasan =$1 and 
              tgl_scan_qr is null`,
              [employee_id],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rows != '') {
                  let arr = [mmf_data];
                  arr = [...arr, results.rows[0]];
                  response.status(200).send({
                    status: 200,
                    message: 'Load Data berhasil',
                    validate_id: employee_id,
                    data: arr,
                  });
                } else {
                  response.status(200).send({
                    status: 200,
                    message: 'Load Data berhasil',
                    validate_id: employee_id,
                    data: mmf_data,
                  });
                }
              }
            );
          } else {
            pool.db_HCM.query(
              `select a.applicant_id,  coalesce(a.nama_depan ,'')||coalesce(a.nama_belakang,'') as nama_karyawan,
              to_char(a.tgl_kerja,'YYYY-MM-DD') as  tgl_kerja, a.position_id as ket_jabatan,
              to_char(a.tgl_lahir ,'YYYY-MM-DD') as  tgl_lahir, a.no_hp_ck, a.email_ck,
              a.userid_ck||'-'||to_char(a.tgl_lahir ,'DDMMYYYY') ||'-'||"password" as qr_code,
              'CALON KARYAWAN' as status
              from trx_calon_karyawan a  
              where nokar_atasan =$1 and 
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
                    data: results.rows[0],
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
          }
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
