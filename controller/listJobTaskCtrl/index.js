const pool = require('../../db');
const axios = require('axios');

// Tabel : employeeworkofftbl, leaverequest_tbl
const controller = {
  getListJobTask(request, response) {
    try {
      const { employee_id } = request.body;

      //insert log activity user -- start
      const data = {
        employee_id: employee_id,
        menu: 'List Job Task',
      };

      const options = {
        headers: {
          'Content-Type': 'application/json',
          API_KEY: process.env.API_KEY,
        },
      };

      axios
        .post(process.env.URL + '/hcm/api/addLogUser', data, options)
        .then((res) => {
          console.log('RESPONSE ==== : ', res.data);
        })
        .catch((err) => {
          console.log('ERROR: ====', err);
        });
      //insert log activity user -- end

      pool.db_MMFPROD.query(
        `with x as ( select 'Persetujuan Izin' Keterangan,initcap(c.display_name) nama , 
        case  when current_date-d.status_date=0 then 'Hari ini' 
        when current_date-d.status_date=1 then 'Kemarin'  
        when current_date-d.status_date=2 then '2 Hari yang lalu'  
        when current_date-d.status_date=3 then '3 Hari yang lalu'  
        when current_date-d.status_date=4 then '4 Hari yang lalu'  
        when current_date-d.status_date=5 then '5 Hari yang lalu'  
        when current_date-d.status_date=6 then '6 Hari yang lalu'  
        when current_date-d.status_date=7 then '7 Hari yang lalu'  
        when current_date-d.status_date>7 then to_char(d.status_date,'DD Mon YYYY') end Durasi_Waktu , 
        a.golid,'Pengajuan Ijin' Keterangan2 , d.status_date  tanggal 
        from employee_work_off_tbl a  
        left join employee_tbl  b on a.employee_id = b.employee_id  
        left join person_tbl c on b.person_id =c.person_id  
        left join work_off_status_tbl d on a.employee_id = d.employee_id and a.sequence_no = d.sequence_no 
        left join (select * from approval_structure_tbl where template_name='APPROVAL_WORK_OFF') e on a.golid = e.ref_id 
        where a.state='Submitted'  and e.approver_id= $1
        union all  
        select 'Persetujuan Cuti' Keterangan,initcap(c.display_name) nama,  
        case  when current_date-request_date=0 then 'Hari ini'  
        when current_date-request_date=1 then 'Kemarin'  
        when current_date-request_date=2 then '2 Hari yang lalu'  
        when current_date-request_date=3 then '3 Hari yang lalu'  
        when current_date-request_date=4 then '4 Hari yang lalu' 
        when current_date-request_date=5 then '5 Hari yang lalu'  
        when current_date-request_date=6 then '6 Hari yang lalu' 
        when current_date-request_date=7 then '7 Hari yang lalu' 
        when current_date-request_date>7 then to_char(request_date,'DD Mon YYYY') end Durasi_Waktu ,
        a.golid,'Pengajuan Cuti' Keterangan2, request_date tanggal from leave_request_tbl  a 
        left join employee_tbl  b on a.employee_id = b.employee_id  
        left join person_tbl c on b.person_id =c.person_id 
        left join (select * from approval_structure_tbl where  template_name='APPROVAL LEAVE') d on a.golid = d.ref_id 
        where a.state='Submitted' and d.approver_id= $1
        union all  
        select 'Persetujuan Dinas' Keterangan,initcap(c.display_name) nama,  
        case  when current_date-d.status_date=0 then 'Hari ini'   
        when current_date-d.status_date=1 then 'Kemarin'   
        when current_date-d.status_date=2 then '2 Hari yang lalu'  
        when current_date-d.status_date=3 then '3 Hari yang lalu'  
        when current_date-d.status_date=4 then '4 Hari yang lalu'  
        when current_date-d.status_date=5 then '5 Hari yang lalu'  
        when current_date-d.status_date=6 then '6 Hari yang lalu'  
        when current_date-d.status_date=7 then '7 Hari yang lalu'  
        when current_date-d.status_date>7 then to_char(d.status_date,'DD Mon YYYY') end Durasi_Waktu , 
        a.golid,'Pengajuan Dinas' Keterangan2, d.status_date tanggal from travel_request_tbl  a  
        left join employee_tbl  b on a.employee_id = b.employee_id  
        left join person_tbl c on b.person_id =c.person_id 
        left join (select request_no, min(status_date) status_date from  
                  travel_request_status_tbl where request_status ='Prepared' 
                  group by request_no) d  on a.request_no = d.request_no 
        where a.golid in  
        (select ref_id from approval_structure_tbl 
        where class_name ='com.sps.travelexpense.transaction.TravelRequest' 
        and approver_id= $1 and ref_id||trim(to_char(approval_sequence,'999999')) in  
        ( 
        with x as (select ref_id,trim(to_char(min(approval_sequence),'999999'))  as seq_min 
        from approval_structure_tbl  
        where class_name ='com.sps.travelexpense.transaction.TravelRequest' 
        and state='Unapproved' and ref_id  in  
        (select golid from travel_request_tbl trt 
        where  state in ('Submitted','Partially Approved') 
        and employee_id in (select employee_id from employee_supervisor_tbl where supervisor_id in 
        (select employee_id from employee_supervisor_tbl where supervisor_id = $1 and current_date between valid_from  and valid_to) 
        and current_date between valid_from  and valid_to 
        union all 
        select employee_id from employee_supervisor_tbl where supervisor_id = $1 and current_date between valid_from  and valid_to) 
        )
        group by ref_id) 
        select ref_id||seq_min as ref_id_min  
         from x 
         )
        and state='Unapproved' ) 
        
        union all 
        select 'Persetujuan Perbaikan Absen' as keterangan,display_name as nama, 
        case  
        when current_date-request_date=0 then 'Hari ini'   
        when current_date-request_date=1 then 'Kemarin'   
        when current_date-request_date=2 then '2 Hari yang lalu'  
        when current_date-request_date=3 then '3 Hari yang lalu'  
        when current_date-request_date=4 then '4 Hari yang lalu'  
        when current_date-request_date=5 then '5 Hari yang lalu'  
        when current_date-request_date=6 then '6 Hari yang lalu'  
        when current_date-request_date=7 then '7 Hari yang lalu'  
        when current_date-request_date>7 then to_char(request_date,'DD Mon YYYY') end durasi_Waktu, a.rev_absence_id as golid,
        'Pengajuan Perbaikan Absen' as keterangan2,request_date as tanggal
        from rev_absence_hcm a
        left join approval_rev_absence_hcm b on a.rev_absence_id = b.rev_absence_id and a.employee_id=b.employee_id
        where a.state='Submitted'  and b.approved_by= $1
         )  
         select keterangan, nama, durasi_waktu,golid,keterangan2 
        from x 
        order by tanggal desc `,
        [employee_id],
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
