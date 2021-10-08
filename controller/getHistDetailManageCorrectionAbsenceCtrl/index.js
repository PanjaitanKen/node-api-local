const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : person_tbl, employee_tbl
const controller = {
  async getHistDetailManageCorrectionAbsence(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, golid, nokar_pengaju } = request.body;

    Helpers.logger(
      'SUCCESS',
      { golid },
      'getHistDetailManageCorrectionAbsenceCtrl.getHistDetailManageCorrectionAbsence'
    );

    try {
      const query = `select a.employee_id, a.employee_id||'/'||to_char(a.request_date,'YYYYMMDD')||'/'||trim(to_char(a.cor_absence_id,'9999999999999999')) as no_pengajuan,
       initcap(a.display_name) nama,
       to_char(a.request_date ,'DD') ||' '||
       case when to_char(a.request_date  ,'MM')='01' then 'Jan'
           when to_char(a.request_date ,'MM')='02' then 'Feb'
           when to_char(a.request_date ,'MM')='03' then 'Mar'
           when to_char(a.request_date ,'MM')='04' then 'Apr'
           when to_char(a.request_date ,'MM')='05' then 'Mei'
           when to_char(a.request_date ,'MM')='06' then 'Jun'
           when to_char(a.request_date ,'MM')='07' then 'Jul'
           when to_char(a.request_date ,'MM')='08' then 'Ags'
           when to_char(a.request_date ,'MM')='09' then 'Sep'
           when to_char(a.request_date ,'MM')='10' then 'Okt'
           when to_char(a.request_date ,'MM')='11' then 'Nov'
           when to_char(a.request_date ,'MM')='12' then 'Des' end ||' '||to_char(a.request_date ,'YYYY') as tgl_pengajuan,            
           to_char(b.clocking_date ,'DD')||' '||
           case when to_char(b.clocking_date ,'MM')='01' then 'Jan'
             when to_char(b.clocking_date ,'MM')='02' then 'Feb'
             when to_char(b.clocking_date ,'MM')='03' then 'Mar'
             when to_char(b.clocking_date ,'MM')='04' then 'Apr'
             when to_char(b.clocking_date ,'MM')='05' then 'Mei'
             when to_char(b.clocking_date ,'MM')='06' then 'Jun'
             when to_char(b.clocking_date ,'MM')='07' then 'Jul'
             when to_char(b.clocking_date ,'MM')='08' then 'Ags'
             when to_char(b.clocking_date ,'MM')='09' then 'Sep'
             when to_char(b.clocking_date ,'MM')='10' then 'Okt'
             when to_char(b.clocking_date ,'MM')='11' then 'Nov'
             when to_char(b.clocking_date ,'MM')='12' then 'Des' end ||' '||to_char(b.clocking_date ,'YYYY') tgl_absen_diperbaiki,
           to_char(a.approval_date ,'DD')||' '||
           case when to_char(a.approval_date ,'MM')='01' then 'Jan'
             when to_char(a.approval_date ,'MM')='02' then 'Feb'
             when to_char(a.approval_date ,'MM')='03' then 'Mar'
             when to_char(a.approval_date ,'MM')='04' then 'Apr'
             when to_char(a.approval_date ,'MM')='05' then 'Mei'
             when to_char(a.approval_date ,'MM')='06' then 'Jun'
             when to_char(a.approval_date ,'MM')='07' then 'Jul'
             when to_char(a.approval_date ,'MM')='08' then 'Ags'
             when to_char(a.approval_date ,'MM')='09' then 'Sep'
             when to_char(a.approval_date ,'MM')='10' then 'Okt'
             when to_char(a.approval_date ,'MM')='11' then 'Nov'
             when to_char(a.approval_date ,'MM')='12' then 'Des' end ||' '||to_char(a.approval_date ,'YYYY') tgl_status,  
       a.cor_absence_id  as golid,
       case when a.state_approval ='Approved' then 'Sudah Proses Persetujuan' else 'Menunggu Persetujuan' end as Status
       from correction_absence_hcm_h a
       left join correction_absence_hcm_d  b on a.cor_absence_id = b.cor_absence_id  
       left join 
         (select employee_id, clocking_date, absence_wage from  
            emp_clocking_detail_tbl where absence_wage like 'CT_%' and employee_id = $2
           ) c on c.employee_id = $2  and to_char(b.clocking_date ,'YYYY-MM-DD') = to_char(c.clocking_date,'YYYY-MM-DD')
       left join 
           (select employee_id,clocking_date, state  
            from employee_work_off_tbl where employee_id = $2
            order by clocking_date desc) d on d.employee_id = $2  and to_char(b.clocking_date,'YYYY-MM-DD')=to_char(d.clocking_date,'YYYY-MM-DD') and d.state='Approved'
       left join 
               (select a.employee_id ,a.request_no ,to_char(b.start_date,'YYYY-MM-DD') tgl_pd
               from travel_request_tbl a 
               left join travel_request_destination_tbl b on a.request_no =b.request_no 
               and state in ('Approved','Partially Approved') and a.employee_id = $2 ) e on e.employee_id = $2  and to_char(b.clocking_date,'YYYY-MM-DD') = e.tgl_pd
       left join emp_clocking_tbl f on f.employee_id= $2  and to_char(b.clocking_date,'YYYY-MM-DD')=to_char(f.clocking_date,'YYYY-MM-DD')
       where a.cor_absence_id = $1 and a.employee_id = $2
           order by b.clocking_date asc`;

      await pool.db_MMFPROD
        .query(query, [golid, nokar_pengaju])
        .then(async ({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            const data1 = rows[0];
            await pool.db_MMFPROD
              .query(
                `select b.cor_id_Detail as id_detail,
                     b.correction_time_in as jam_masuk_diperbaiki , b.correction_time_in as jam_keluar_diperbaiki,
                     to_char(b.correction_time_in,'HH24:MI') jam_masuk_diperbaiki_string,
                     to_char(b.correction_time_out,'HH24:MI') jam_keluar_diperbaiki_string,
                     case when c.absence_wage is not null then 'Pengajuan di tolak karena ada Cuti'
                   when d.employee_id is not null then 'Pengajuan di tolak karena ada Izin' 
                   when e.employee_id is not null then 'Pengajuan di tolak karena ada PD' else a.note end as alasan,  b.state,
                     case when c.absence_wage is not null then '1' else '0' end as status_cuti,
               case when d.employee_id is not null then '1' else '0' end as status_izin,
               case when e.employee_id is not null then '1' else '0' end as status_PD,
               case when (f.state in ('Approved','Transfered') or f.result_revised = 'N')   then '1' 
               when DATE_PART('month', current_Date) - DATE_PART('month', a.request_date)>1 then '2' 
               else '0' end as status_perbaikan
               from correction_absence_hcm_h a
               left join correction_absence_hcm_d  b on a.cor_absence_id = b.cor_absence_id  
               left join 
                 (select employee_id, clocking_date, absence_wage from  
                    emp_clocking_detail_tbl where absence_wage like 'CT_%' and employee_id = $2
                   ) c on c.employee_id = $2  and to_char(b.clocking_date ,'YYYY-MM-DD') = to_char(c.clocking_date,'YYYY-MM-DD')
               left join 
                   (select employee_id,clocking_date, state  
                    from employee_work_off_tbl   where employee_id = $2
                    order by clocking_date desc) d on d.employee_id = $2  and to_char(b.clocking_date,'YYYY-MM-DD')=to_char(d.clocking_date,'YYYY-MM-DD') and d.state='Approved'
               left join 
                       (select a.employee_id ,a.request_no ,to_char(b.start_date,'YYYY-MM-DD') tgl_pd
                       from travel_request_tbl a 
                       left join travel_request_destination_tbl b on a.request_no =b.request_no 
                       and state in ('Approved','Partially Approved') and a.employee_id = $2 ) e on e.employee_id = $2   and to_char(b.clocking_date,'YYYY-MM-DD') = e.tgl_pd
               left join emp_clocking_tbl f on f.employee_id = $2  and to_char(b.clocking_date,'YYYY-MM-DD')=to_char(f.clocking_date,'YYYY-MM-DD')
               where a.cor_absence_id = $1 and a.employee_id = $2
                   order by b.clocking_date asc`,
                [golid, nokar_pengaju]
              )
              .then(async ({ rows }) => {
                // eslint-disable-next-line eqeqeq
                if (rows != 0) {
                  const data2 = rows;
                  data1.data_detail = data2;
                  response.status(200).send({
                    status: 200,
                    message: 'Load Data berhasil',
                    validate_id: employee_id,
                    data: data1,
                  });
                } else {
                  response.status(200).send({
                    status: 200,
                    message: 'Data already Exist',
                    validate_id: employee_id,
                    data: '',
                  });
                }
              })
              .catch((error) => {
                Helpers.logger(
                  'ERROR',
                  { golid },
                  'getHistDetailManageCorrectionAbsenceCtrl.getHistDetailManageCorrectionAbsence',
                  error
                );
                throw error;
              });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: employee_id,
              data: '',
            });
          }
        })
        .catch((error) => {
          Helpers.logger(
            'ERROR',
            { golid },
            'getHistDetailManageCorrectionAbsenceCtrl.getHistDetailManageCorrectionAbsence',
            error
          );
          throw error;
        });
    } catch (err) {
      Helpers.logger(
        'ERROR',
        { golid },
        'getHistDetailManageCorrectionAbsenceCtrl.getHistDetailManageCorrectionAbsence',
        err
      );
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
