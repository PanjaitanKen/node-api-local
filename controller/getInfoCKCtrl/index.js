const pool = require('../../db');
const { validationResult } = require('express-validator');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getInfoCK(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);
    try {
      const { employee_id, userid_ck } = request.body;

      pool.db_MMFPROD.query(
        `select count(*) flag from candidate_appointment_tbl
        where (new_assign_employee is not null and new_assign_employee <>'')
        and candidate_id = $1`,
        [userid_ck],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            console.log(results.rows[0].flag);
            if (results.rows[0].flag >= 1) {
              pool.db_MMFPROD.query(
                `select a.applicant_id,   a.state ,a.first_name as nama_depan,a.last_name as nama_belakang,
                date_applied as tgl_input, b.appointment_date tgl_penunjukan, b.starting_date tgl_kerja,
                point_of_hire tempat_rekrut,  
                a.place_of_birth as tempat_lahir, a.date_of_birth as tgl_lahir, have_child punya_anak, 
                a.address as alamat, address_state as prop_alamat, postal_code as kodepos_alamat,city as kota_alamat,
                case when a.blood_type='1' then 'A+'
                    when a.blood_type='2' then 'B+'
                    when a.blood_type='3' then 'AB+' 
                    when a.blood_type='4' then 'O+'
                    when a.blood_type='5' then 'A-' 
                    when a.blood_type='6' then 'B-' 
                    when a.blood_type='7' then 'AB-' 
                    when a.blood_type='8' then 'O-' 
                else ' ' end as gol_darah,
                case when a.marital_status='1' then 'Married'
                     when a.marital_status='2' then 'Unmarried'
                     when a.marital_status='2' then 'Widow(er)'
                else ' ' end as marital_status,
                case when a.gender='1' then 'Wanita'
                     when a.gender='2' then 'Laki-laki'
                else ' ' end as jenis_kelamin,
                b.new_assign_employee as employee_id, 
                b.company_office , n.contact_value as no_hp_ck, o.contact_value as email_ck,
                e.recruitment_officer_id , g.display_name as nama_recruiter,
                l.contact_value  as no_hp_recruiter, m.contact_value  as email_recruiter,
                b.new_sup_emp as nokar_atasan, d.display_name as nama_atasan,
                i.employee_id as nokar_mentor, j.display_name as nama_mentor,
                b.grade_id ,b.org_id ,k.identification_value as noktp,
                b.npwp_no ,b.bank_code as kode_bank,b.branch_name as rek_bank_cabang ,
                b.account_no as norek,b.acc_name_holder as an_rek,a.applicant_id as userid_ck,
                null as password, null as tgl_expired, CURRENT_TIMESTAMP as tgl_transfer,
                null as tgl_scan_qr, p.position_id, q.name as nama_suami_istri, r.name as nama_ibu, s.name as nama_ayah
                from applicant_tbl a
                left join candidate_appointment_tbl b on a.applicant_id = b.candidate_id
                left join employee_tbl c on b.new_sup_emp = c.employee_id 
                left join person_tbl d on c.person_id =d.person_id 
                left join personnel_requisition_tbl e on b.personnel_req_no = e.personnel_req_no 
                left join employee_tbl f on e.recruitment_officer_id = f.employee_id 
                left join person_tbl g on f.person_id =g.person_id 
                left join employee_supervisor_tbl h on c.employee_id =h.employee_id and current_date between h.valid_from and h.valid_to 
                left join employee_tbl i on h.supervisor_id = i.employee_id 
                left join person_tbl j on i.person_id =j.person_id 
                left join applicant_identification_tbl k on a.applicant_id=k.applicant_id and identification_type ='1'
                left join person_contact_method_tbl l on f.person_id = l.person_id and l.default_address ='Y' and l.contact_type='3' 
                left join person_contact_method_tbl m on f.person_id = m.person_id and m.default_address ='Y' and m.contact_type='4' 
                
                left join applicant_contact_info_tbl n on a.applicant_id = n.applicant_id and n.default_address ='Y' and n.contact_type='3' 
                left join applicant_contact_info_tbl o on a.applicant_id = o.applicant_id and o.default_address ='Y' and o.contact_type='4'
                
                left join employee_position_tbl p on b.new_assign_employee = p.employee_id  and current_Date between p.valid_from and p.valid_to

                left join applicant_family_tbl q on a.applicant_id = q.applicant_id and q.relationship_type ='1'
                left join applicant_family_tbl r on a.applicant_id = r.applicant_id and r.relationship_type ='2' and r.gender='1'
                left join applicant_family_tbl s on a.applicant_id = s.applicant_id and s.relationship_type ='2' and s.gender='2'   

                where b.candidate_id =$1 and (new_assign_employee is not null and new_assign_employee <>'') `,
                [userid_ck],
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
            } else {
              pool.db_MMFPROD.query(
                `select b.employee_id as applicant_id, 'Employed' as state, a.first_name as nama_depan, a.last_name as nama_belakang, 
                b.entry_date as tgl_input,b.entry_date as tgl_penunjukan, b.first_join_date as tgl_kerja,
                c.company_office as tempat_rekrut, a.place_birth as tempat_lahir,a.birth_date  as tgl_lahir,
                ' ' punya_anak,d.address as alamat, d.state prop_alamat,d.postal_code kodepos_alamat,
                d.city as kota_alamat, 
                case when a.blood_type='1' then 'A+'
                    when a.blood_type='2' then 'B+'
                    when a.blood_type='3' then 'AB+' 
                    when a.blood_type='4' then 'O+'
                    when a.blood_type='5' then 'A-' 
                    when a.blood_type='6' then 'B-' 
                    when a.blood_type='7' then 'AB-' 
                    when a.blood_type='8' then 'O-' 
                else ' ' end as gol_darah,
                case when a.marital_status='1' then 'Married'
                     when a.marital_status='2' then 'Unmarried'
                     when a.marital_status='2' then 'Widow(er)'
                else ' ' end as marital_status,
                case when a.gender='1' then 'Wanita'
                     when a.gender='2' then 'Laki-laki'
                else ' ' end as jenis_kelamin, b.employee_id, c.company_office ,
                s.contact_value as no_hp_ck, t.contact_value as email_ck,
                b.entry_by ,l.display_name as nama_entry,
                q.contact_value  as no_hp_recruiter, r.contact_value  as email_recruiter,
                e.supervisor_id as nokar_atasan, g.display_name as nama_atasan, 
                n.employee_id as nokar_mentor, o.display_name as nama_mentor, 
                h.org_id,p.identification_value as noktp, i.npwp_no ,j.bank_code as kode_bank, j.branch_name as rek_bank_cabang ,
                j.account_no as norek,j.acc_name_holder as an_rek,null as password, null as tgl_expired, CURRENT_TIMESTAMP as tgl_transfer,
                null as tgl_scan_qr, u.position_id,
                v.name as nama_suami_istri, w.name as nama_ibu, x.name as nama_ayah
                from person_tbl a 
                left join employee_tbl b on a.person_id =b.person_id 
                left join emp_company_office_tbl c on b.employee_id = c.employee_id 
                     and current_Date between c.valid_from and c.valid_to
                left join person_address_tbl d on a.person_id = d.person_id 
                left join employee_supervisor_tbl e on b.employee_id = e.employee_id 
                 and current_Date between e.valid_from and e.valid_to
                left join employee_tbl f on e.supervisor_id = f.employee_id 
                left join person_tbl g on f.person_id =g.person_id 
                left join employee_organization_tbl h on b.employee_id = h.employee_id 
                      and current_Date between h.valid_from and h.valid_to
                left join emp_payroll_info_tbl i on b.employee_id = i.employee_id  
                left join (
                select max(process_no) as process_no ,account_no ,
                acc_name_holder, bank_code, branch_name, employee_id 
                from emp_account_info_tbl 
                group by account_no ,acc_name_holder, bank_code , employee_id, branch_name
                ) j on b.employee_id = j.employee_id
                left join employee_tbl k on b.entry_by = k.employee_id 
                left join person_tbl l on k.person_id =l.person_id 
                left join employee_supervisor_tbl m on f.employee_id =m.employee_id and current_date between m.valid_from and m.valid_to 
                left join employee_tbl n on m.supervisor_id = n.employee_id 
                left join person_tbl o on n.person_id =o.person_id 
                left join person_identification_tbl p on a.person_id = p.person_id and identification_type ='1'
                left join person_contact_method_tbl q on l.person_id = q.person_id and q.default_address ='Y' and q.contact_type='3' 
                left join person_contact_method_tbl r on l.person_id = r.person_id and r.default_address ='Y' and r.contact_type='4' 
                left join person_contact_method_tbl s on a.person_id = s.person_id and s.default_address ='Y' and s.contact_type='3' 
                left join person_contact_method_tbl t on a.person_id = t.person_id and t.default_address ='Y' and t.contact_type='4'
                
                left join employee_position_tbl u on b.employee_id = u.employee_id  and current_Date between u.valid_from and u.valid_to

                left join person_family_tbl v on a.person_id = v.person_id and v.relationship_type ='1'
                left join person_family_tbl w on a.person_id = w.person_id and w.relationship_type ='2' and w.gender='1'
                left join person_family_tbl x on a.person_id = x.person_id and x.relationship_type ='2' and x.gender='2'
                
                where b.employee_id =$1 and c.company_office is not null`,
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
