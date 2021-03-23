const pool = require('../../db');
// Tabel : travel_request_tbl, travel_request_destination_tbl
const controller = {
  getHistDetailManageTravel(request, response) {
    try {
      const { employee_id, golid } = request.body;

      pool.db_MMFPROD.query(
        ' select d.display_name as nama, a.employee_id, a.request_no nobukti,  ' +
          " to_char(f.status_date,'DD')||' '||   " +
          " case when to_char(f.status_date,'MM')='01' then 'Jan' " +
          " when to_char(f.status_date,'MM')='02' then 'Feb'  " +
          " when to_char(f.status_date,'MM')='03' then 'Mar' " +
          " when to_char(f.status_date,'MM')='04' then 'Apr' " +
          " when to_char(f.status_date,'MM')='05' then 'Mei' " +
          " when to_char(f.status_date,'MM')='06' then 'Jun' " +
          " when to_char(f.status_date,'MM')='07' then 'Jul' " +
          " when to_char(f.status_date,'MM')='08' then 'Ags' " +
          " when to_char(f.status_date,'MM')='09' then 'Sep' " +
          " when to_char(f.status_date,'MM')='10' then 'Okt' " +
          " when to_char(f.status_date,'MM')='11' then 'Nov' " +
          " when to_char(f.status_date,'MM')='12' then 'Des' end ||' '||to_char(f.status_date,'YYYY') as tgl_pengajuan, " +
          " e.state, case when e.state='Approved' then 'Disetujui' " +
          " when e.state='Rejected' then 'Ditolak' " +
          " when e.state='Submitted' then 'Menunggu Persetujuan'  " +
          " when e.state='Cancelled' then 'Batal' " +
          " when e.state='Partially Approved' then 'Disetujui Sebagian' " +
          ' end as Status ,d.display_name as nama, ' +
          " to_char(e.approved_date,'DD')||' '||   " +
          " case when to_char(e.approved_date,'MM')='01' then 'Jan' " +
          " when to_char(e.approved_date,'MM')='02' then 'Feb' " +
          " when to_char(e.approved_date,'MM')='03' then 'Mar' " +
          " when to_char(e.approved_date,'MM')='04' then 'Apr' " +
          " when to_char(e.approved_date,'MM')='05' then 'Mei' " +
          " when to_char(e.approved_date,'MM')='06' then 'Jun' " +
          " when to_char(e.approved_date,'MM')='07' then 'Jul' " +
          " when to_char(e.approved_date,'MM')='08' then 'Ags' " +
          " when to_char(e.approved_date,'MM')='09' then 'Sep' " +
          " when to_char(e.approved_date,'MM')='10' then 'Okt'  " +
          " when to_char(e.approved_date,'MM')='11' then 'Nov' " +
          " when to_char(e.approved_date,'MM')='12' then 'Des' end ||' '||to_char(e.approved_date,'YYYY') as tgl_persetujuan," +
          ' a.golid ' +
          ' from travel_request_tbl a ' +
          ' left join employee_tbl c on a.employee_id =c.employee_id ' +
          ' left join person_tbl d on c.person_id =d.person_id  ' +
          ' left join (select *   ' +
          ' from approval_structure_tbl  ' +
          " where class_name ='com.sps.travelexpense.transaction.TravelRequest' " +
          ' and ref_id= $2 and approver_id = $1) e on a.golid = e.ref_id and e.approver_id = $1 ' +
          ' left join (select request_no, min(status_date) status_date from  ' +
          "            travel_request_status_tbl where request_status ='Prepared' " +
          '            group by request_no) f  on a.request_no = f.request_no ' +
          ' where a.golid = $2 ',
        [employee_id, golid],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            const respData = results.rows[0];
            pool.db_MMFPROD.query(
              `select  coalesce(b.pcx_purpose,' - ') as keperluan, 
              to_char(b.start_date,'DD')||' '||  
              case when to_char(b.start_date,'MM')='01' then 'Jan' 
              when to_char(b.start_date,'MM')='02' then 'Feb'  
              when to_char(b.start_date,'MM')='03' then 'Mar'  
              when to_char(b.start_date,'MM')='04' then 'Apr'  
              when to_char(b.start_date,'MM')='05' then 'Mei'  
              when to_char(b.start_date,'MM')='06' then 'Jun'  
              when to_char(b.start_date,'MM')='07' then 'Jul'  
              when to_char(b.start_date,'MM')='08' then 'Ags'  
              when to_char(b.start_date,'MM')='09' then 'Sep'  
              when to_char(b.start_date,'MM')='10' then 'Okt'  
              when to_char(b.start_date,'MM')='11' then 'Nov'  
              when to_char(b.start_date,'MM')='12' then 'Des' end ||' '||to_char(b.start_date,'YYYY') ||' - '||
              to_char(b.end_date,'DD')||' '||  
              case when to_char(b.end_date,'MM')='01' then 'Jan'  
              when to_char(b.end_date,'MM')='02' then 'Feb'  
              when to_char(b.end_date,'MM')='03' then 'Mar'  
              when to_char(b.end_date,'MM')='04' then 'Apr'  
              when to_char(b.end_date,'MM')='05' then 'Mei'  
              when to_char(b.end_date,'MM')='06' then 'Jun'  
              when to_char(b.end_date,'MM')='07' then 'Jul' 
              when to_char(b.end_date,'MM')='08' then 'Ags'  
              when to_char(b.end_date,'MM')='09' then 'Sep'  
              when to_char(b.end_date,'MM')='10' then 'Okt'  
              when to_char(b.end_date,'MM')='11' then 'Nov' 
              when to_char(b.end_date,'MM')='12' then 'Des' end ||' '||to_char(b.end_date,'YYYY') as tgl_dari_sampai, coalesce(destination,'-') as tujuan, 
              coalesce(pcx_note,'-') as keterangan
              from travel_request_tbl a  
              left join travel_request_destination_tbl b on a.company_id = b.company_id and a.employee_id =b.employee_id and a.request_no =b.request_no  
              left join employee_tbl c on a.employee_id =c.employee_id 
              left join person_tbl d on c.person_id =d.person_id 
              where a.golid = $1
                `,
              [golid],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rows != '') {
                  const respData2 = results.rows;
                  respData.data_detail = respData2;
                  response.status(200).send({
                    status: 200,
                    message: 'Load Data berhasil',
                    validate_id: employee_id,
                    data: respData,
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
