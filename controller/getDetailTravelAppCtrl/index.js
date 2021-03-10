const pool = require('../../db');
// Tabel : travel_request_tbl, travel_request_destination_tbl
const controller = {
  getDetail_Travel_App(request, response) {
    try {
      const { golid } = request.body;

      pool.db_MMFPROD.query(
        ' select a.employee_id, a.request_no nobukti,  ' +
          " to_char(a.request_date,'DD')||' '||   " +
          " case when to_char(a.request_date,'MM')='01' then 'Jan' " +
          " when to_char(a.request_date,'MM')='02' then 'Feb' " +
          " when to_char(a.request_date,'MM')='03' then 'Mar' " +
          " when to_char(a.request_date,'MM')='04' then 'Apr' " +
          " when to_char(a.request_date,'MM')='05' then 'Mei' " +
          " when to_char(a.request_date,'MM')='06' then 'Jun' " +
          " when to_char(a.request_date,'MM')='07' then 'Jul' " +
          " when to_char(a.request_date,'MM')='08' then 'Ags' " +
          " when to_char(a.request_date,'MM')='09' then 'Sep' " +
          " when to_char(a.request_date,'MM')='10' then 'Okt' " +
          " when to_char(a.request_date,'MM')='11' then 'Nov' " +
          " when to_char(a.request_date,'MM')='12' then 'Des' end ||' '||to_char(a.request_date,'YYYY') as tgl_pengajuan, " +
          " a.state, case when a.state='Approved' then 'Disetujui' " +
          " when a.state='Rejected' then 'Ditolak' " +
          " when a.state='Submitted' then 'Menunggu Persetujuan'  " +
          " when a.state='Cancelled' then 'Batal' end as Status ,d.display_name as nama," +
          ' appr_1, appr_2, appr_3, appr_4, appr_5, a.golid, ' +
          " 'MMF - Mandala Multifinance Tbk' as company_id " +
          ' from travel_request_tbl a  ' +
          ' left join employee_tbl c on a.employee_id =c.employee_id ' +
          ' left join person_tbl d on c.person_id =d.person_id ' +
          ' left join ( ' +
          ' with x as (select ref_id, ' +
          " max(case when approval_sequence ='1' then initcap(c.display_name) else ' ' end) as approval_1, " +
          " max(case when approval_sequence ='1' then state else ' ' end) as status_approval_1, " +
          " max(case when approval_sequence ='2' then initcap(c.display_name)  else ' ' end) as approval_2, " +
          " max(case when approval_sequence ='2' then state else ' ' end) as status_approval_2, " +
          " max(case when approval_sequence ='3' then initcap(c.display_name)  else ' ' end) as approval_3, " +
          " max(case when approval_sequence ='3' then state else ' ' end) as status_approval_3, " +
          " max(case when approval_sequence ='4' then initcap(c.display_name)  else ' ' end) as approval_4, " +
          " max(case when approval_sequence ='4' then state else ' ' end) as status_approval_4, " +
          " max(case when approval_sequence ='5' then initcap(c.display_name)  else ' ' end) as approval_5, " +
          " max(case when approval_sequence ='5' then state else ' ' end) as status_approval_5 " +
          ' from approval_structure_tbl a ' +
          ' left join employee_tbl b on a.approver_id=b.employee_id ' +
          ' left join person_tbl c on b.person_id = c.person_id ' +
          ' where ' +
          " ref_id =  $1 and class_name ='com.sps.travelexpense.transaction.TravelRequest' " +
          ' group by ref_id) ' +
          " select ref_id,case when status_approval_1='Approved' then 'Telah disetujui oleh '||approval_1 " +
          " when status_approval_1='Unapproved' then 'Menunggu persetujuan oleh '||approval_1 " +
          " when status_approval_1='Cancelled' then 'Telah dibatalkan oleh '||approval_1 " +
          " when status_approval_1='Rejected' then 'Telah ditolak oleh '||approval_1 " +
          " when status_approval_1='Skipped' then 'Telah diteruskan oleh '||approval_1 " +
          " else ' ' end as appr_1, " +
          " case when status_approval_2='Approved' then 'Telah disetujui oleh '||approval_2 " +
          " when status_approval_2='Unapproved' then 'Menunggu persetujuan oleh '||approval_2 " +
          " when status_approval_2='Cancelled' then 'Telah dibatalkan oleh '||approval_2 " +
          " when status_approval_2='Rejected' then 'Telah ditolak oleh '||approval_2 " +
          " when status_approval_2='Skipped' then 'Telah diteruskan oleh '||approval_2 " +
          " else ' ' end as appr_2, " +
          " case when status_approval_3='Approved' then 'Telah disetujui oleh '||approval_3 " +
          " when status_approval_3='Unapproved' then 'Menunggu persetujuan oleh '||approval_3 " +
          " when status_approval_3='Cancelled' then 'Telah dibatalkan oleh '||approval_3 " +
          " when status_approval_3='Rejected' then 'Telah ditolak oleh '||approval_3 " +
          " when status_approval_3='Skipped' then 'Telah diteruskan oleh '||approval_3 " +
          " else ' ' end as appr_3, " +
          " case when status_approval_4='Approved' then 'Telah disetujui oleh '||approval_4 " +
          " when status_approval_4='Unapproved' then 'Menunggu persetujuan oleh '||approval_4 " +
          " when status_approval_4='Cancelled' then 'Telah dibatalkan oleh '||approval_4 " +
          " when status_approval_4='Rejected' then 'Telah ditolak oleh '||approval_4 " +
          " when status_approval_4='Skipped' then 'Telah diteruskan oleh '||approval_4 " +
          " else ' ' end as appr_4, " +
          " case when status_approval_5='Approved' then 'Telah disetujui oleh '||approval_5 " +
          " when status_approval_5='Unapproved' then 'Menunggu persetujuan oleh '||approval_5 " +
          "  when status_approval_5='Cancelled' then 'Telah dibatalkan oleh '||approval_5 " +
          "  when status_approval_5='Rejected' then 'Telah ditolak oleh '||approval_5 " +
          "  when status_approval_5='Skipped' then 'Telah diteruskan oleh '||approval_5 " +
          " else ' ' end as appr_5 " +
          ' from x ' +
          ' ) e on a.golid=e.ref_id ' +
          ' where a.golid = $1 ',
        [golid],
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
                    data: respData,
                  });
                } else {
                  response.status(200).send({
                    status: 200,
                    message: 'Data Tidak Ditemukan',
                    data: results.rows,
                  });
                }
              }
            );
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
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
