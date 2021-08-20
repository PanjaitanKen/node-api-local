const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');

// Tabel : person_tbl, employee_tbl
const controller = {
  async getHistAbsenceNew(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, filter_date } = request.body;
    const data_filter_date = filter_date === 0 ? 30 : 30;

    Helpers.logger(
      'SUCCESS',
      { employee_id },
      'getHistAbsenceNewCtrl.getHistAbsenceNew'
    );

    try {
      const query = `select to_char(a.tgl_bulan_ini,'YYYY-MM-DD') as tgl_absen,
        to_char(a.tgl_bulan_ini,'DD') Tanggal, 
        case when trim(to_char(a.tgl_bulan_ini,'Day'))='Sunday' then 'Min'
                when trim(to_char(a.tgl_bulan_ini,'Day'))='Monday' then 'Sen'
                when trim(to_char(a.tgl_bulan_ini,'Day'))='Tuesday' then 'Sel'
                when trim(to_char(a.tgl_bulan_ini,'Day'))='Wednesday' then 'Rab'
                when trim(to_char(a.tgl_bulan_ini,'Day'))='Thursday' then 'Kam'
                when trim(to_char(a.tgl_bulan_ini,'Day'))='Friday' then 'Jum'
                when trim(to_char(a.tgl_bulan_ini,'Day'))='Saturday' then 'Sab' else ' ' end as hari,
        case when to_char(a.tgl_bulan_ini,'MM')='01' then 'Januari'
                when to_char(a.tgl_bulan_ini,'MM')='02' then 'Februari'
                when to_char(a.tgl_bulan_ini,'MM')='03' then 'Maret'
                when to_char(a.tgl_bulan_ini,'MM')='04' then 'April'
                when to_char(a.tgl_bulan_ini,'MM')='05' then 'Mei'
                when to_char(a.tgl_bulan_ini,'MM')='06' then 'Juni'
                when to_char(a.tgl_bulan_ini,'MM')='07' then 'Juli'
                when to_char(a.tgl_bulan_ini,'MM')='08' then 'Agustus'
                when to_char(a.tgl_bulan_ini,'MM')='09' then 'September'
                when to_char(a.tgl_bulan_ini,'MM')='10' then 'Oktober'
                when to_char(a.tgl_bulan_ini,'MM')='11' then 'November'
                when to_char(a.tgl_bulan_ini,'MM')='12' then 'Desember' end as Bulan,
         $1::text employee_id , tgl_jam_masuk, tgl_jam_pulang, 
        b.jam_masuk, c.jam_pulang, d.state,
        case when d.status_error_masuk is null then '0'
             when d.status_error_masuk='0' then '0'
         else '1' end as status_error_masuk, e.state,
        case when e.status_error_pulang is null then '0'
             when e.status_error_pulang='0' then '0'
        else '1' end as status_error_pulang,
        m.schedule_type ,m.day_type ,to_Char(n.time_in,'HH24:MI') as default_jam_masuk, 
        to_Char(n.time_out,'HH24:MI') as default_jam_pulang, 
        case when f.absence_wage is not null then '1' else '0' end as status_cuti,
        case when g.employee_id is not null then '1' else '0' end as status_izin,
        case when h.employee_id is not null then '1' else '0' end as status_PD,
        case when (i.state in ('Approved','Transfered') or i.result_revised = 'N') or j.state in ('Approved','Submitted') or a.tgl_bulan_ini<k.first_join_date 
            or to_char(a.tgl_bulan_ini,'YYYY-MM')<to_char(CURRENT_DATE,'YYYY-MM') or to_char(a.tgl_bulan_ini,'YYYY-MM-DD')=to_char(CURRENT_DATE,'YYYY-MM-DD') then '1' else '0' end as status_perbaikan,
        case when j.state='Submitted' then '1'
                     when j.state='Approved' then '2'
                     when j.state='Rejected' then '3'
                     when j.state='Cancelled' then '4'
        else '0' end as status_verifikasi_perbaikan
        from 	
        (select * from 
          generate_series(date_trunc('month',CURRENT_DATE - interval '1 months'),
          date_trunc('month',now()) + '1 month' - '1 day'::interval,'1 day') as tgl_bulan_ini
        ) a
        left join 	
          (select a.employee_id,to_Char(a.clocking_date,'YYYY-MM-DD') as tanggal_absen, 
           min(a.clocking_date) as tgl_jam_masuk ,min(to_char(a.clocking_date ,'HH24:MI')) jam_masuk
           from emp_clocking_temp_tbl a
           where in_out ='0' and employee_id = $1  
           group by a.employee_id, a.in_out, to_Char(a.clocking_date,'YYYY-MM-DD'),a.clocking_date 
           order by a.clocking_date desc
          ) b on to_char(a.tgl_bulan_ini,'YYYY-MM-DD') = b.tanggal_absen
        left join 
          (select a.employee_id,to_Char(a.clocking_date,'YYYY-MM-DD') as tanggal_absen, 
           max(a.clocking_date) as tgl_jam_pulang ,max(to_char(a.clocking_date ,'HH24:MI')) jam_pulang
           from emp_clocking_temp_tbl a
           where in_out ='1' and employee_id = $1
           group by a.employee_id, a.in_out, to_Char(a.clocking_date,'YYYY-MM-DD'),a.clocking_date 
           order by a.clocking_date desc
          ) c on to_char(a.tgl_bulan_ini,'YYYY-MM-DD') = c.tanggal_absen
        left join 
          (select employee_id ,to_char(clocking_date ,'YYYY-MM-DD') tanggal_absen,to_char(clocking_date ,'HH24:MI') jam_masuk,state,
          case when state in ('Error') then '1' else '0' end status_error_masuk,
             transfer_message  as transfer_message_masuk 
             from emp_clocking_temp_tbl where in_out='0' 
             and employee_id= $1 ) d on b.tanggal_absen = d.tanggal_absen and b.jam_masuk= d.jam_masuk
        left join 
          (select employee_id ,to_char(clocking_date ,'YYYY-MM-DD') tanggal_absen,to_char(clocking_date ,'HH24:MI') jam_pulang,state,
           case when state in ('Error') then '1' else '0' end status_error_pulang,
             transfer_message  as transfer_message_masuk 
             from emp_clocking_temp_tbl where in_out='1' 
             and employee_id= $1 ) e on c.tanggal_absen = e.tanggal_absen and c.jam_pulang= e.jam_pulang 
        left join 
          (select employee_id, clocking_date, absence_wage from  
             emp_clocking_detail_tbl where absence_wage like 'CT_%'
            ) f on f.employee_id= $1  and to_char(a.tgl_bulan_ini,'YYYY-MM-DD') = to_char(f.clocking_date,'YYYY-MM-DD')
        left join 
            (select employee_id,clocking_date, state  
             from employee_work_off_tbl where  
             employee_id = $1
             order by clocking_date desc) g on g.employee_id=$1 and to_char(a.tgl_bulan_ini,'YYYY-MM-DD')=to_char(g.clocking_date,'YYYY-MM-DD') and g.state='Approved'
        left join 
                (select a.employee_id ,a.request_no ,to_char(b.start_date,'YYYY-MM-DD') tgl_pd
                from travel_request_tbl a 
                left join travel_request_destination_tbl b on a.request_no =b.request_no 
                where a.employee_id = $1 
                and state in ('Approved','Partially Approved')) h on h.employee_id= $1  and to_char(a.tgl_bulan_ini,'YYYY-MM-DD') = h.tgl_pd
        left join emp_clocking_tbl i on i.employee_id = $1 and a.tgl_bulan_ini = i.clocking_date
        left join 
            (
                            with x as (select max(a.cor_absence_id) max_cor_absence_id,clocking_date ,b.employee_id
                                  from correction_absence_hcm_d  a
                                  left join correction_absence_hcm_h b on a.cor_absence_id = b.cor_absence_id
                                  where b.employee_id = $1
                                  group by a.clocking_date ,b.employee_id
                              ) select y.*,x.employee_id from x
                          left join correction_absence_hcm_d y on x.max_cor_absence_id = y.cor_absence_id 
                 ) j on j.employee_id = $1 and a.tgl_bulan_ini = j.clocking_date
        left join employee_tbl  k on k.employee_id = $1   
        left join emp_work_schedule_tbl l on l.employee_id = $1 and current_date between l.valid_from and l.valid_to
        left join work_schedule_cycle_tbl m on l.schedule_type = m.schedule_type   and m.day_sequence='1'
        left join day_type_tbl n on m.day_type = n.day_type 
        where tgl_bulan_ini  between (current_date -interval '1 days' * $2) and now()
        order by tgl_bulan_ini desc`;

      await pool.db_MMFPROD
        .query(query, [employee_id, data_filter_date])
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data Berhasil',
              validate_id: employee_id,
              data: rows,
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
            { employee_id },
            'getHistAbsenceNewCtrl.getHistAbsenceNew',
            error
          );
          throw error;
        });
    } catch (err) {
      Helpers.logger(
        'ERROR',
        { employee_id },
        'getHistAbsenceNewCtrl.getHistAbsenceNew',
        err
      );
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
