const _ = require('lodash');
const axios = require('axios');
const dateFormat = require('dateformat');

const pool = require('./db');
const Helpers = require('./helpers');

class Jobs {
  static checkServiceHost() {
    // eslint-disable-next-line arrow-body-style
    const checkServiceHostByURL = (url = '') => {
      return new Promise((resolve) => {
        if (url !== '') {
          pool.db_HCM.query('SELECT * FROM param_hcm', (error, results) => {
            if (error) throw error;

            const email = _.filter(
              results.rows,
              (o) => o.setting_name === 'ALERTSERVICE_EMAILRECIPIENT'
            )[0].setting_value;

            if (email) {
              axios
                .get(url)
                .then(() => resolve(false))
                .catch(({ response: { data } }) => {
                  Helpers.sendEmail(
                    `Service Host ${url} sedang bermasalah`,
                    data.replace(/(<([^>]+)>)/gi, ''),
                    email
                  );

                  resolve(true);
                });
            }
          });
        }
      });
    };

    pool.db_HCM.query(
      'SELECT setting_name, setting_value FROM param_hcm',
      async (error, results) => {
        if (error) throw error;

        const CONFIGURATIONS = {
          ALERTSERVICE_ISACTIVE_PROD: _.filter(
            results.rows,
            (o) => o.setting_name === 'ALERTSERVICE_ISACTIVE_PROD'
          )[0].setting_value,
          ALERTSERVICE_ISACTIVE_UAT: _.filter(
            results.rows,
            (o) => o.setting_name === 'ALERTSERVICE_ISACTIVE_UAT'
          )[0].setting_value,
          ALERTSERVICE_ISACTIVE_DEV: _.filter(
            results.rows,
            (o) => o.setting_name === 'ALERTSERVICE_ISACTIVE_DEV'
          )[0].setting_value,
        };

        if (
          CONFIGURATIONS.ALERTSERVICE_ISACTIVE_PROD === '0' &&
          (await checkServiceHostByURL(
            'https://hcm-mobile.mandalafinance.co.id'
          ))
        ) {
          pool.db_HCM.query(
            "UPDATE param_hcm SET setting_value = '1' WHERE setting_name = 'ALERTSERVICE_ISACTIVE_PROD'",
            (error) => {
              if (error) throw error;
            }
          );
        }

        if (
          CONFIGURATIONS.ALERTSERVICE_ISACTIVE_UAT === '0' &&
          (await checkServiceHostByURL('https://hcm-uat.mandalafinance.co.id'))
        ) {
          pool.db_HCM.query(
            "UPDATE param_hcm SET setting_value = '1' WHERE setting_name = 'ALERTSERVICE_ISACTIVE_UAT'",
            (error) => {
              if (error) throw error;
            }
          );
        }

        if (
          CONFIGURATIONS.ALERTSERVICE_ISACTIVE_DEV === '0' &&
          (await checkServiceHostByURL('https://hcm-dev.mandalafinance.co.id'))
        ) {
          pool.db_HCM.query(
            "UPDATE param_hcm SET setting_value = '1' WHERE setting_name = 'ALERTSERVICE_ISACTIVE_DEV'",
            (error) => {
              if (error) throw error;
            }
          );
        }
      }
    );
  }

  static resetValueCheckServiceHostToZero() {
    pool.db_HCM.query(
      "UPDATE param_hcm SET setting_value = '0' WHERE setting_name IN('ALERTSERVICE_ISACTIVE_PROD', 'ALERTSERVICE_ISACTIVE_UAT', 'ALERTSERVICE_ISACTIVE_DEV')",
      (error) => {
        if (error) throw error;
      }
    );
  }

  static handleCalonKaryawan(category = '') {
    try {
      let QUERY = '';

      if (category === 'PERSONNEL_ACQUISITION') {
        QUERY = `select candidate_id, new_assign_employee from candidate_appointment_tbl
                    where new_assign_employee is not null
                    and current_date between appointment_date and starting_date`;
      } else if (category === 'NON_PERSONNEL_ACQUISITION') {
        QUERY = `select a.employee_id, a.person_id from employee_tbl a
                    left join candidate_appointment_tbl b on a.employee_id = b.new_assign_employee 
                    left join person_tbl c on a.person_id = c.person_id 
                    where b.new_assign_employee is null 
                    and current_date between a.entry_date and a.first_join_date 
                    and to_char(a.entry_date ,'YYYY-MM-DD')>='2020-01-01'  
                    and display_name not like '%TES%'
                    order by first_join_date desc`;
      }

      pool.db_MMFPROD.query(QUERY, (error, results) => {
        if (error) throw error;

        if (results.rowCount > 0) {
          let QUERY_CATEGORY = '';

          if (category === 'PERSONNEL_ACQUISITION') {
            QUERY_CATEGORY = `select a.applicant_id,   a.state ,a.first_name as nama_depan,a.last_name as nama_belakang,
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
              null as tgl_scan_qr, pp.internal_title as position_id,
              q.name as nama_suami_istri, r.name as nama_ibu, s.name as nama_ayah,
              t.contact_value as no_hp_atasan, u.contact_value as email_atasan
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
              left join position_tbl pp on p.position_id = pp.position_id
              left join applicant_family_tbl q on a.applicant_id = q.applicant_id and q.relationship_type ='1'
              left join applicant_family_tbl r on a.applicant_id = r.applicant_id and r.relationship_type ='2' and r.gender='1'
              left join applicant_family_tbl s on a.applicant_id = s.applicant_id and s.relationship_type ='2' and s.gender='2'

              left join person_contact_method_tbl t on d.person_id = t.person_id and t.default_address ='Y' and t.contact_type='3' 
              left join person_contact_method_tbl u on d.person_id = u.person_id and u.default_address ='Y' and u.contact_type='4' 

              where b.candidate_id = $1 and (b.new_assign_employee is not null and b.new_assign_employee <>'')
              and current_date between appointment_date and starting_date`;
          } else if (category === 'NON_PERSONNEL_ACQUISITION') {
            QUERY_CATEGORY = `select b.employee_id as applicant_id, 'Employed' as state, a.first_name as nama_depan, a.last_name as nama_belakang, 
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
              b.entry_by as recruitment_officer_id, l.display_name as nama_recruiter,
              q.contact_value  as no_hp_recruiter, r.contact_value  as email_recruiter,
              e.supervisor_id as nokar_atasan, g.display_name as nama_atasan, 
              n.employee_id as nokar_mentor, o.display_name as nama_mentor, 
              h.org_id,p.identification_value as noktp, i.npwp_no ,j.bank_code as kode_bank, j.branch_name as rek_bank_cabang ,
              j.account_no as norek,j.acc_name_holder as an_rek,null as password, null as tgl_expired, CURRENT_TIMESTAMP as tgl_transfer,
              null as tgl_scan_qr, uu.internal_title as position_id,
              v.name as nama_suami_istri, w.name as nama_ibu, x.name as nama_ayah,
              y.contact_value as no_hp_atasan, z.contact_value as email_atasan
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
                    and current_Date between e.valid_from and e.valid_to
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
              left join position_tbl uu on u.position_id = uu.position_id
              
              left join person_family_tbl v on a.person_id = v.person_id and v.relationship_type ='1'
              left join person_family_tbl w on a.person_id = w.person_id and w.relationship_type ='2' and w.gender='1'
              left join person_family_tbl x on a.person_id = x.person_id and x.relationship_type ='2' and x.gender='2'

              left join person_contact_method_tbl y on o.person_id = y.person_id and y.default_address ='Y' and y.contact_type='3' 
              left join person_contact_method_tbl z on o.person_id = z.person_id and z.default_address ='Y' and z.contact_type='4' 

              where b.employee_id = $1 and c.company_office is not null`;
          }

          results.rows.forEach((data) => {
            let employee_id = null;
            let applicant_id = null;

            if (category === 'PERSONNEL_ACQUISITION') {
              employee_id = data.new_assign_employee;
              applicant_id = data.candidate_id;
            } else if (category === 'NON_PERSONNEL_ACQUISITION') {
              employee_id = data.employee_id;
              applicant_id = data.employee_id;
            }

            pool.db_HCM.query(
              `select count(*) jumlah from trx_calon_karyawan
                  where applicant_id = $1`,
              [applicant_id],
              (error, results) => {
                if (error) throw error;

                if (results.rows[0].jumlah === '0') {
                  pool.db_MMFPROD.query(
                    QUERY_CATEGORY,
                    [applicant_id],
                    (error, results) => {
                      if (error) throw error;

                      const {
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
                        tgl_transfer,
                        position_id,
                        nama_suami_istri,
                        nama_ibu,
                        nama_ayah,
                        no_hp_atasan,
                        email_atasan,
                      } = results.rows[0];

                      const formatTglInput = dateFormat(
                        tgl_input,
                        'yyyy-mm-dd'
                      );

                      const formatTglPenunjukan = dateFormat(
                        tgl_penunjukan,
                        'yyyy-mm-dd'
                      );

                      const formatTglKerja = dateFormat(
                        tgl_kerja,
                        'yyyy-mm-dd'
                      );

                      const formatTglLahir = dateFormat(
                        tgl_lahir,
                        'yyyy-mm-dd'
                      );

                      const formatTglTransfer = dateFormat(
                        tgl_transfer,
                        'yyyy-mm-dd hh:MM:ss'
                      );

                      const password = Helpers.encrypt(
                        `Mandala-${dateFormat(tgl_lahir, 'ddmmyy')}`
                      );

                      pool.db_HCM.query(
                        `INSERT INTO trx_calon_karyawan
                            (applicant_id, state, nama_depan, nama_belakang, tgl_input, tgl_penunjukan, tgl_kerja, tempat_rekrut, tempat_lahir,
                            tgl_lahir, punya_anak, alamat, prop_alamat, kodepos_alamat, kota_alamat, gol_darah, marital_status, jenis_kelamin,
                            employee_id, company_office, no_hp_ck, email_ck, recruitment_officer_id, nama_recruiter, no_hp_recruiter, email_recruiter,
                            nokar_atasan, nama_atasan, nokar_mentor, nama_mentor, grade_id, org_id, noktp, npwp_no, kode_bank, rek_bank_cabang,
                            norek, an_rek, userid_ck, password, tgl_expired, tgl_transfer, tgl_scan_qr, position_id, nama_suami_istri, nama_ibu, nama_ayah)
                            values
                            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37,
                            $38, $39, $40, null, $41, null, $42, $43, $44, $45, $46, $47)`,
                        [
                          applicant_id,
                          state,
                          nama_depan,
                          nama_belakang,
                          formatTglInput,
                          formatTglPenunjukan,
                          formatTglKerja,
                          tempat_rekrut,
                          tempat_lahir,
                          formatTglLahir,
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
                          applicant_id,
                          password,
                          formatTglTransfer,
                          position_id,
                          nama_suami_istri,
                          nama_ibu,
                          nama_ayah,
                          no_hp_atasan,
                          email_atasan,
                        ],
                        (error, results) => {
                          if (error) throw error;

                          if (results.rowCount > 0) {
                            pool.db_HCM.query(
                              `insert into trx_akses_menu_ck
                                  select $1 as applicant_id, id_menu_ck, null as tgl_akses
                                  from mas_menu_ck mmc`,
                              [applicant_id],
                              (error, results) => {
                                if (error) throw error;

                                if (results.rowCount > 0) {
                                  axios
                                    .post(
                                      'http://192.168.0.222/hcm/',
                                      {
                                        to: no_hp_ck,
                                        header:
                                          'Calon Karyawan PT Mandala Finance',
                                        text:
                                          'Selamat bergabung di PT Mandala Finance, Tbk, saat ini status anda adalah calon karyawan, silahkan untuk mendownload aplikasi MPower by PT. Mandala Finance di playstore cari dengan nama MPower - MFIN atau melalui link tautan ini https://play.google.com/store/apps/details?id=com.hcm.mandala',
                                        text2: `Login dengan User ID: ${applicant_id}\ndan\nPassword: ${Helpers.decrypt(
                                          password
                                        )}`,
                                      },
                                      {
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                      }
                                    )
                                    .catch((error) => {
                                      throw error;
                                    });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  );
                }
              }
            );
          });
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}

module.exports = Jobs;
