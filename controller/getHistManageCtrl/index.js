const pool = require('../../db');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  getHistManage(request, response) {
    try {
      const { employee_id, jumlah_hari, tipe_filter } = request.body;

      pool.db_MMFPROD.query(
        `with x as (
                  select 'Persetujuan Cuti' as Jenis, 'Riwayat Persetujuan Cuti' as jenis2, a.employee_id , to_char(b.sequence_no,'9999999999999999') as no_urut,  initcap(d.display_name) nama,
                  case  when current_date-b.status_date=0 then 'Hari ini'
                    when current_date-b.status_date=1 then 'Kemarin'
                    when current_date-b.status_date=2 then '2 Hari yang lalu'
                    when current_date-b.status_date=3 then '3 Hari yang lalu'
                    when current_date-b.status_date=4 then '4 Hari yang lalu'
                    when current_date-b.status_date=5 then '5 Hari yang lalu'
                    when current_date-b.status_date=6 then '6 Hari yang lalu'
                    when current_date-b.status_date=7 then '7 Hari yang lalu'
                    when current_date-b.status_date>7 then to_char(b.status_date,'DD Mon YYYY') 
                  end Durasi_Waktu ,b.status_date, a.golid, a.leave_name as tipe_cuti, 'Cuti' as tipe_filter,
                  a.employee_id||'/'||to_char(b.status_date,'YYYYMMDD')||'/'||trim(to_char(b.sequence_no,'9999999999999999')) as nobukti 
                  from leave_request_tbl a
                  left join l_r_status_history_tbl b on a.employee_id =b.employee_id and to_char(a.sequence_no,'9999999999999999') = to_char(b.sequence_no,'9999999999999999')  and b.status<>'Submitted'
                  left join employee_tbl  c on a.employee_id = c.employee_id 
                  left join person_tbl d on c.person_id =d.person_id 
                  where  state not in ('Submitted') and 
                  b.status_date between (current_date -interval '1 days' * $2) and now()
                  and a.employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id = $1  
                  and valid_to=date'9999-01-01') 
                  union all 
                  select 'Persetujuan Izin' as Jenis, 'Riwayat Persetujuan Izin' as Jenis2, a.employee_id,  to_char(b.sequence_no,'9999999999999999') as no_urut, initcap(d.display_name) nama,
                  case  when current_date-b.status_date=0 then 'Hari ini'
                    when current_date-b.status_date=1 then 'Kemarin'
                    when current_date-b.status_date=2 then '2 Hari yang lalu'
                    when current_date-b.status_date=3 then '3 Hari yang lalu'
                    when current_date-b.status_date=4 then '4 Hari yang lalu'
                    when current_date-b.status_date=5 then '5 Hari yang lalu'
                    when current_date-b.status_date=6 then '6 Hari yang lalu'
                    when current_date-b.status_date=7 then '7 Hari yang lalu'
                    when current_date-b.status_date>7 then to_char(b.status_date,'DD Mon YYYY') 
                  end Durasi_Waktu ,b.status_date, a.golid, e.wage_name  as tipe_cuti, 'Izin' as tipe_filter,
                  a.employee_id||'/'||to_char(b.status_date,'YYYYMMDD')||'/'||trim(to_char(b.sequence_no,'9999999999999999')) as nobukti 
                  from employee_work_off_tbl  a
                  left join work_off_status_tbl b on a.employee_id =b.employee_id and to_char(a.sequence_no,'9999999999999999') = to_char(b.sequence_no,'9999999999999999')  and b.status<>'Submitted'
                  left join employee_tbl  c on a.employee_id = c.employee_id 
                  left join person_tbl d on c.person_id =d.person_id 
                  left join wage_code_tbl e on a.absence_wage =e.wage_code
                  where  state not in ('Submitted') and 
                  b.status_date between (current_date -interval '1 days' * $2 ) and now()
                  and a.employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id = $1
                  and valid_to=date'9999-01-01') 
                  
                   union all
                  select 'Persetujuan Perjalanan Dinas' as Jenis, 'Riwayat Persetujuan Perjalanan Dinas' as Jenis2, a.employee_id,  a.request_no as no_urut, initcap(c.display_name) nama,
                  case  when current_date-d.status_date=0 then 'Hari ini'
                  when current_date-d.status_date=1 then 'Kemarin'
                  when current_date-d.status_date=2 then '2 Hari yang lalu'
                  when current_date-d.status_date=3 then '3 Hari yang lalu'
                  when current_date-d.status_date=4 then '4 Hari yang lalu'
                  when current_date-d.status_date=5 then '5 Hari yang lalu'
                  when current_date-d.status_date=6 then '6 Hari yang lalu'
                  when current_date-d.status_date=7 then '7 Hari yang lalu'
                  when current_date-d.status_date>7 then to_char(d.status_date,'DD Mon YYYY') 
                end Durasi_Waktu ,d.status_date, a.golid, 'Perjalanan Dinas'  as tipe_cuti, 'Perjalanan Dinas' as tipe_filter,
                a.request_no as nobukti
                from travel_request_tbl  a
                left join employee_tbl  b on a.employee_id = b.employee_id 
                left join person_tbl c on b.person_id =c.person_id 
                left join travel_request_status_tbl d on a.employee_id = d.employee_id and a.request_no = d.request_no 
                left join (
                          select * from approval_structure_tbl where 
                          class_name ='com.sps.travelexpense.transaction.TravelRequest' 
                ) e on a.golid = e.ref_id and e.state not in ('Submitted','Prepared') 
                where  d.request_status not in ('Submitted','Prepared') and 
                d.status_date between (current_date -interval '1 days' *  $2 ) and now()
                and e.approved_by = $1  
                  
                ) select * from x
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
