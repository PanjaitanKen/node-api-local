const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : emp_clocking_temp_tbl
const controller = {
  getHistDetailManageRevAbsence(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { rev_id } = request.body;

    Helpers.logger(
      'SUCCESS',
      {
        rev_id,
      },
      'getHistDetailManageRevAbsenceCtrl.getHistDetailManageRevAbsence'
    );

    try {
      pool.db_MMFPROD.query(
        `select a.employee_id, a.employee_id||'/'||to_char(a.request_date,'YYYYMMDD')||'/'||trim(to_char(b.sequence_no,'9999999999999999')) as no_pengajuan,
        trim(to_char(b.sequence_no,'9999999999999999')) as no_urut, initcap(a.display_name) nama,
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
             to_char(a.clocking_date ,'DD')||' '||
             case when to_char(a.clocking_date ,'MM')='01' then 'Jan'
               when to_char(a.clocking_date ,'MM')='02' then 'Feb'
               when to_char(a.clocking_date ,'MM')='03' then 'Mar'
               when to_char(a.clocking_date ,'MM')='04' then 'Apr'
               when to_char(a.clocking_date ,'MM')='05' then 'Mei'
               when to_char(a.clocking_date ,'MM')='06' then 'Jun'
               when to_char(a.clocking_date ,'MM')='07' then 'Jul'
               when to_char(a.clocking_date ,'MM')='08' then 'Ags'
               when to_char(a.clocking_date ,'MM')='09' then 'Sep'
               when to_char(a.clocking_date ,'MM')='10' then 'Okt'
               when to_char(a.clocking_date ,'MM')='11' then 'Nov'
               when to_char(a.clocking_date ,'MM')='12' then 'Des' end ||' '||to_char(a.clocking_date ,'YYYY') tgl_absen_diperbaiki ,
         to_char(b.status_Date ,'DD')||' '||
             case when to_char(b.status_Date ,'MM')='01' then 'Jan'
               when to_char(b.status_Date ,'MM')='02' then 'Feb'
               when to_char(b.status_Date ,'MM')='03' then 'Mar'
               when to_char(b.status_Date ,'MM')='04' then 'Apr'
               when to_char(b.status_Date ,'MM')='05' then 'Mei'
               when to_char(b.status_Date ,'MM')='06' then 'Jun'
               when to_char(b.status_Date ,'MM')='07' then 'Jul'
               when to_char(b.status_Date ,'MM')='08' then 'Ags'
               when to_char(b.status_Date ,'MM')='09' then 'Sep'
               when to_char(b.status_Date ,'MM')='10' then 'Okt'
               when to_char(b.status_Date ,'MM')='11' then 'Nov'
               when to_char(b.status_Date ,'MM')='12' then 'Des' end ||' '||to_char(b.status_Date ,'YYYY') tgl_status, 
               TO_CHAR(reg_time_in,'YYYY-MM-DD HH24:MI:SS') as jam_masuk_terdaftar ,TO_CHAR(reg_time_out,'YYYY-MM-DD HH24:MI:SS') as jam_keluar_terdaftar,  
               TO_CHAR(rev_time_in,'YYYY-MM-DD HH24:MI:SS') as jam_masuk_diperbaiki, TO_CHAR(rev_time_out,'YYYY-MM-DD HH24:MI:SS') as jam_keluar_diperbaiki,
               a.reason as alasan,  a.rev_absence_id  as golid,
               case when a.state='Approved' then 'Disetujui'
                  when a.state='Rejected' then 'Ditolak'
                  when a.state='Submitted' then 'Menunggu Persetujuan'
                  when a.state='Cancelled' then 'Batal'
         end as Status, category_rev_id as kategori_perbaikan_absen
               
         from rev_absence_hcm a
     left join approval_rev_absence_hcm  b on a.rev_absence_id=b.rev_absence_id  and a.employee_id = b.employee_id 
         where a.rev_absence_id = $1`,
        [rev_id],
        (error, results) => {
          if (error) {
            Helpers.logger(
              'ERROR',
              {
                rev_id,
              },
              'getHistDetailManageRevAbsenceCtrl.getHistDetailManageRevAbsence',
              error
            );

            throw error;
          }

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              validate_id: rev_id,
              data: results.rows[0],
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: rev_id,
              data: results.rows,
            });
          }
        }
      );
    } catch (err) {
      Helpers.logger(
        'ERROR',
        {
          rev_id,
        },
        'getHistDetailManageRevAbsenceCtrl.getHistDetailManageRevAbsence',
        err
      );

      response.status(500).send(err);
    }
  },
};

module.exports = controller;
