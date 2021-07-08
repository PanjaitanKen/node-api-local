const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getHistManage(request, response) {
    try {
      const { employee_id, jumlah_hari, tipe_filter } = request.body;

      pool.db_MMFPROD.query(
        `with x as (
          select 'Persetujuan Cuti' as Jenis, 'Riwayat Persetujuan Cuti' as jenis2, aa.employee_id, 
          to_char(aa.sequence_no,'9999999999999999') as no_urut,  initcap(d.display_name) nama,
          case  when current_date-a.approved_date =0 then 'Hari ini'
              when current_date-a.approved_date =1 then 'Kemarin'
              when current_date-a.approved_date =2 then '2 Hari yang lalu'
              when current_date-a.approved_date =3 then '3 Hari yang lalu'
              when current_date-a.approved_date =4 then '4 Hari yang lalu'
              when current_date-a.approved_date =5 then '5 Hari yang lalu'
              when current_date-a.approved_date =6 then '6 Hari yang lalu'
              when current_date-a.approved_date =7 then '7 Hari yang lalu'
              when current_date-a.approved_date >7 then to_char(a.approved_date ,'DD Mon YYYY') 
          end Durasi_Waktu ,a.approved_date  as status_date, aa.golid, aa.leave_name as tipe_cuti, 'Cuti' as tipe_filter,
          aa.employee_id||'/'||to_char(a.approved_date,'YYYYMMDD')||'/'||trim(to_char(aa.sequence_no,'9999999999999999')) as 	nobukti 
          from approval_structure_tbl a
          left join leave_request_tbl aa on a.ref_id = aa.golid 
          left join employee_tbl  c on aa.employee_id = c.employee_id 
          left join person_tbl d on c.person_id =d.person_id 
          where template_name='APPROVAL LEAVE'
          and approved_by =$1  and a.approved_date between (current_date -interval '1 days' * $2) and now()
          union all 
          select 'Persetujuan Izin' as Jenis, 'Riwayat Persetujuan Izin' as Jenis2, aa.employee_id,  	to_char(aa.sequence_no,'9999999999999999') as no_urut, initcap(d.display_name) nama,
          case  when current_date-a.approved_date=0 then 'Hari ini'
              when current_date-a.approved_date=1 then 'Kemarin'
              when current_date-a.approved_date=2 then '2 Hari yang lalu'
              when current_date-a.approved_date=3 then '3 Hari yang lalu'
              when current_date-a.approved_date=4 then '4 Hari yang lalu'
              when current_date-a.approved_date=5 then '5 Hari yang lalu'
              when current_date-a.approved_date=6 then '6 Hari yang lalu'
              when current_date-a.approved_date=7 then '7 Hari yang lalu'
              when current_date-a.approved_date>7 then to_char(a.approved_date,'DD Mon YYYY') 
          end Durasi_Waktu ,a.approved_date status_date, aa.golid, e.wage_name  as tipe_cuti, 'Izin' as tipe_filter,	               	aa.employee_id||'/'||to_char(a.approved_date,'YYYYMMDD')||'/'||trim(to_char(aa.sequence_no,'9999999999999999')) as 	nobukti 
          from approval_structure_tbl a
          left join employee_work_off_tbl  aa on a.ref_id=aa.golid 
          left join employee_tbl  c on aa.employee_id = c.employee_id 
          left join person_tbl d on c.person_id =d.person_id 
          left join wage_code_tbl e on aa.absence_wage =e.wage_code
          where template_name='APPROVAL_WORK_OFF'
          and approved_by =$1  and a.approved_date between (current_date -interval '1 days' * $2) and now()
          union all 
          select 'Persetujuan Dinas' as Jenis, 'Riwayat Persetujuan Dinas' as Jenis2, aa.employee_id,  	aa.request_no as no_urut, initcap(c.display_name) nama,
          case when current_date-a.approved_date=0 then 'Hari ini'
             when current_date-a.approved_date=1 then 'Kemarin'
             when current_date-a.approved_date=2 then '2 Hari yang lalu'
             when current_date-a.approved_date=3 then '3 Hari yang lalu'
             when current_date-a.approved_date=4 then '4 Hari yang lalu'
             when current_date-a.approved_date=5 then '5 Hari yang lalu'
             when current_date-a.approved_date=6 then '6 Hari yang lalu'
             when current_date-a.approved_date=7 then '7 Hari yang lalu'
             when current_date-a.approved_date>7 then to_char(d.status_date,'DD Mon YYYY') 
             end Durasi_Waktu ,a.approved_date status_date, aa.golid, 'Perjalanan Dinas'  as tipe_cuti, 
             'Perjalanan Dinas' as tipe_filter,
          aa.request_no as nobukti
          from approval_structure_tbl a
          left join travel_request_tbl  aa on a.ref_id = aa.golid 
          left join employee_tbl  b on aa.employee_id = b.employee_id 
          left join person_tbl c on b.person_id =c.person_id 
          left join travel_request_status_tbl d on aa.employee_id = d.employee_id and aa.request_no = d.request_no and d.user_emp_id = $1
          where a.class_name ='com.sps.travelexpense.transaction.TravelRequest' 
          and a.approved_by =$1  
          and a.approved_date between (current_date -interval '1 days' * $2) and now()
          union all 
           select 'Persetujuan Perbaikan Absen' as Jenis, 'Riwayat Persetujuan Perbaikan Absen' as Jenis2, a.employee_id,  	
to_char(a.sequence_no,'9999999999999999') as no_urut, initcap(b.display_name) nama,
          case  when current_date-a.status_date=0 then 'Hari ini'
              when current_date-a.status_date=1 then 'Kemarin'
              when current_date-a.status_date=2 then '2 Hari yang lalu'
              when current_date-a.status_date=3 then '3 Hari yang lalu'
              when current_date-a.status_date=4 then '4 Hari yang lalu'
              when current_date-a.status_date=5 then '5 Hari yang lalu'
              when current_date-a.status_date=6 then '6 Hari yang lalu'
              when current_date-a.status_date=7 then '7 Hari yang lalu'
              when current_date-a.status_date>7 then to_char(a.status_date,'DD Mon YYYY') 
          end Durasi_Waktu ,a.status_date status_date, a.rev_absence_id, 'Perbaikan Absen'  as tipe_cuti, 'Perbaikan Absen' as tipe_filter,	               	
          a.employee_id||'/'||to_char(a.status_date,'YYYYMMDD')||'/'||trim(to_char(a.sequence_no,'9999999999999999')) as nobukti 
          from approval_rev_absence_hcm a
  left join rev_absence_hcm b on a.rev_absence_id = b.rev_absence_id and a.employee_id=b.employee_id
          where status <>'Submitted'
          and approved_by =$1  and a.status_date between (current_date -interval '1 days' * $2) and now()  
          
          )
          select * from x
             where tipe_filter = ANY($3) 
            order by status_Date desc , no_urut desc`,
        [employee_id, jumlah_hari, tipe_filter],
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
