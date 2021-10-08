/* eslint-disable no-tabs */
const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : person_tbl, employee_tbl
const controller = {
  async getCalendarCorrectionAbsence(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id } = request.body;
    // const data_filter_date = filter_date === 0 ? 30 : 30;
    const openNextPrev = true;

    Helpers.logger(
      'SUCCESS',
      { employee_id },
      'getCalendarCorrectionAbsenceCtrl.getCalendarCorrectionAbsence'
    );

    try {
      const query = `with x as (select to_char(a.tgl_bulan_ini,'YYYY-MM-DD') as tgl_absen, a.tgl_bulan_ini,
      $1::text employee_id , tgl_jam_masuk, tgl_jam_pulang, 
       --case when d.status_error_masuk='1' then null else b.jam_masuk end as jam_masuk,
       --case when e.status_error_pulang='1' then null else c.jam_pulang end as jam_pulang,
      
       case when j.state in ('Approved','Submitted') then to_char(j.correction_time_in,'HH24:MI') 
       when j.state is null and d.status_error_masuk='1' then null 
       when p.clocking_Date is not null then to_char(p.time_in,'HH24:MI') else b.jam_masuk end as jam_masuk,
  
  	   case when j.state in ('Approved','Submitted') then to_char(j.correction_time_out,'HH24:MI')  
       when j.state is null and e.status_error_pulang='1' then null 
       when p.clocking_Date is not null then to_char(p.time_out,'HH24:MI') else c.jam_pulang end as jam_pulang,
      
      m.schedule_type ,m.day_type ,to_Char(n.time_in,'HH24:MI') as default_jam_masuk, 
      to_Char(n.time_out,'HH24:MI') as default_jam_pulang, 
      case when f.absence_wage is not null then '1' else '0' end as status_cuti,
      case when g.employee_id is not null then '1' else '0' end as status_izin,
      case when h.employee_id is not null then '1' else '0' end as status_PD,
      case when (i.state in ('Approved','Transfered') or i.result_revised = 'N') or j.state in ('Approved','Submitted','Rejected') or a.tgl_bulan_ini<k.first_join_date 
          or to_char(a.tgl_bulan_ini,'YYYY-MM')<to_char(CURRENT_DATE - interval '1 months','YYYY-MM')  
          or to_char(a.tgl_bulan_ini,'YYYY-MM-DD')=to_char(CURRENT_DATE,'YYYY-MM-DD') 
          or (m.schedule_type in ('JAM_KERJA_HO', 'JAM_KERJA_WILAYAH', 'P_JAM_KERJA_HO', 'P_JAM_KERJA_WILAYAH') and m.day_sequence ='6') then '1' else '0' end as status_perbaikan,
      case when j.state='Submitted' then '1'
                   when j.state='Approved' then '2'
                   when j.state='Rejected' then '3'
                   when j.state='Cancelled' then '4'
      else '0' end as status_verifikasi_perbaikan,
      case when (status_libur=true or (m.day_type='OFFHOLIDAY' and m.day_sequence ='0')) then 1 else 0 end as hari_libur,
      coalesce(d.status_error_masuk,'0') status_error_masuk, coalesce(e.status_error_pulang,'0') status_error_pulang
      from
      (select *,EXTRACT(ISODOW FROM tgl_bulan_ini) as hari_ke from 
        generate_series(date_trunc('month',CURRENT_DATE - interval '1 months'),
        date_trunc('month',now()) + '1 month' - '1 day'::interval,'1 day') as tgl_bulan_ini
      ) a
      left join 	
        (select a.employee_id,to_Char(a.clocking_date,'YYYY-MM-DD') as tanggal_absen, 
         min(a.clocking_date) as tgl_jam_masuk ,min(to_char(a.clocking_date ,'HH24:MI')) jam_masuk
         from emp_clocking_temp_tbl a
         where in_out ='0' and employee_id = $1 
         group by a.employee_id, a.in_out, to_Char(a.clocking_date,'YYYY-MM-DD')
        ) b on to_char(a.tgl_bulan_ini,'YYYY-MM-DD') = b.tanggal_absen
      left join 
        (select a.employee_id,to_Char(a.clocking_date,'YYYY-MM-DD') as tanggal_absen, 
         max(a.clocking_date) as tgl_jam_pulang ,max(to_char(a.clocking_date ,'HH24:MI')) jam_pulang
         from emp_clocking_temp_tbl a
         where in_out ='1' and employee_id = $1 
         group by a.employee_id, a.in_out, to_Char(a.clocking_date,'YYYY-MM-DD') 
        ) c on to_char(a.tgl_bulan_ini,'YYYY-MM-DD') = c.tanggal_absen
      left join 
        (select a.employee_id ,to_char(a.clocking_date ,'YYYY-MM-DD') tanggal_absen,to_char(a.clocking_date ,'HH24:MI') jam_masuk,state,
        case when a.state in ('Error') and b.time_in is null then '1' else '0' end status_error_masuk,
           transfer_message  as transfer_message_masuk 
           from emp_clocking_temp_tbl a
           left join emp_clocking_detail_tbl b on a.employee_id =b.employee_id and to_char(a.clocking_date,'YYYY-MM-DD') =to_char(b.clocking_date,'YYYY-MM-DD') 
           where in_out='0' and a.state ='Error'
           and a.employee_id= $1 ) d on b.tanggal_absen = d.tanggal_absen and b.jam_masuk= d.jam_masuk
      left join 
        (select a.employee_id ,to_char(a.clocking_date ,'YYYY-MM-DD') tanggal_absen,to_char(a.clocking_date ,'HH24:MI') jam_pulang,state,
         case when a.state in ('Error') and b.time_out is null then '1' else '0' end status_error_pulang,
           transfer_message  as transfer_message_masuk ,b.employee_id ,b.time_out 
           from emp_clocking_temp_tbl a
           left join emp_clocking_detail_tbl b on a.employee_id =b.employee_id and to_char(a.clocking_date,'YYYY-MM-DD') =to_char(b.clocking_date,'YYYY-MM-DD') 
           where in_out='1' and a.state ='Error'
           and a.employee_id= $1 
           order by a.clocking_date desc) e on c.tanggal_absen = e.tanggal_absen and c.jam_pulang= e.jam_pulang 
      left join 
        (select employee_id, clocking_date, absence_wage from  
           emp_clocking_detail_tbl where absence_wage like 'CT_%'
          ) f on f.employee_id= $1and to_char(a.tgl_bulan_ini,'YYYY-MM-DD') = to_char(f.clocking_date,'YYYY-MM-DD')
      left join 
          (select employee_id,clocking_date, state  
           from employee_work_off_tbl where  
           employee_id = $1
           order by clocking_date desc) g on g.employee_id = $1 and to_char(a.tgl_bulan_ini,'YYYY-MM-DD')=to_char(g.clocking_date,'YYYY-MM-DD') and g.state='Approved'
      left join 
              (select a.employee_id ,a.request_no ,to_char(b.start_date,'YYYY-MM-DD') tgl_pd,
              to_char(b.end_date,'YYYY-MM-DD') tgl_pd_sd
              from travel_request_tbl a 
              left join travel_request_destination_tbl b on a.request_no =b.request_no 
              where a.employee_id = $1 
              and state in ('Approved','Partially Approved')) h on h.employee_id= $1and to_char(a.tgl_bulan_ini,'YYYY-MM-DD') between h.tgl_pd and h.tgl_pd_sd
      left join emp_clocking_tbl i on i.employee_id = $1 and a.tgl_bulan_ini = i.clocking_date
      left join 
          (
                          with x as (select max(a.cor_absence_id) max_cor_absence_id,clocking_date ,b.employee_id
                                from correction_absence_hcm_d  a
                                left join correction_absence_hcm_h b on a.cor_absence_id = b.cor_absence_id
                                where b.employee_id = $1
                                group by a.clocking_date ,b.employee_id
                            ) select y.*,x.employee_id from x
                        left join correction_absence_hcm_d y on x.max_cor_absence_id = y.cor_absence_id  and x.clocking_date = y.clocking_date
               ) j on j.employee_id = $1 and a.tgl_bulan_ini = j.clocking_date
      left join employee_tbl  k on k.company_id='MMF' and k.employee_id = $1 
      left join emp_work_schedule_tbl l on l.company_id='MMF' and l.employee_id = $1 and current_date between l.valid_from and l.valid_to
      left join work_schedule_cycle_tbl m on l.schedule_type = m.schedule_type   and m.day_sequence=a.hari_ke
      left join day_type_tbl n on m.day_type = n.day_type 
      left join 
          (select substitute_date as tgl_libur, 
          true as status_libur 
          from day_sub_detail_tbl where company_id='MMF' and substitute_type like 'LIBUR NASIONAL%'
          union all 
          SELECT  mydate as sunday, true as status_libur FROM 
          generate_series(to_date((select min(to_char(substitute_date,'YYYY')) min_thn from day_sub_detail_tbl) ||'-01-01','YYYY-MM-DD'),  
          to_date((select max(to_char(substitute_date,'YYYY')) max_thn from day_sub_detail_tbl)||'-12-31','YYYY-MM-DD'), '1 day') AS g(mydate) 
          WHERE EXTRACT(DOW FROM mydate) = 0 
          ) o on a.tgl_bulan_ini = o.tgl_libur
      left join     
          (
            select * from emp_clocking_detail_tbl  ect where off_site ='N' and 
            absence_wage is null order by clocking_date desc
          ) p on p.employee_id = $1 and a.tgl_bulan_ini = p.clocking_date   
      where tgl_bulan_ini  between date_trunc('month', current_date- interval '1 months') and (date_trunc('MONTH', now()) + INTERVAL '1 MONTH - 1 day')::date
      order by tgl_bulan_ini desc
      ) select tgl_absen, jam_masuk, jam_pulang,
      schedule_type, day_type, 
      status_cuti,status_izin, status_pd,status_perbaikan,status_verifikasi_perbaikan,hari_libur ,
      case when hari_libur= '0' and status_cuti='0' and status_izin='0' and status_pd='0' and status_perbaikan='0'
      and status_verifikasi_perbaikan in ('0','3','4') and (jam_masuk is null or jam_pulang is null) 
      and tgl_bulan_ini<current_date 
      then 1 else 0 end  as bisa_dipilih
      from x
      order by tgl_absen desc`;

      await pool.db_MMFPROD
        .query(query, [employee_id])
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data Berhasil',
              validate_id: employee_id,
              open_next_prev: openNextPrev,
              data: rows,
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              validate_id: employee_id,
              open_next_prev: openNextPrev,
              data: '',
            });
          }
        })
        .catch((error) => {
          Helpers.logger(
            'ERROR',
            { employee_id },
            'getCalendarCorrectionAbsenceCtrl.getCalendarCorrectionAbsence',
            error
          );
          throw error;
        });
    } catch (err) {
      Helpers.logger(
        'ERROR',
        { employee_id },
        'getCalendarCorrectionAbsenceCtrl.getCalendarCorrectionAbsence',
        err
      );
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
