const pool = require('../../db');

// Tabel : leave_request_tbl
const controller = {
  async getHist_Leave(request, response) {
    try {
      const { employee_id, filter, waktu } = request.body;

      const query =
        ' select a.employee_id ,leave_name, ' +
        " to_char(a.leave_date_from,'DD')||' '|| " +
        " case when to_char(a.leave_date_from ,'MM')='01' then 'Jan' " +
        " when to_char(a.leave_date_from,'MM')='02' then 'Feb' " +
        "  when to_char(a.leave_date_from,'MM')='03' then 'Mar' " +
        "  when to_char(a.leave_date_from,'MM')='04' then 'Apr' " +
        "  when to_char(a.leave_date_from,'MM')='05' then 'Mei' " +
        "  when to_char(a.leave_date_from,'MM')='06' then 'Jun' " +
        "  when to_char(a.leave_date_from,'MM')='07' then 'Jul' " +
        "  when to_char(a.leave_date_from,'MM')='08' then 'Ags' " +
        "  when to_char(a.leave_date_from,'MM')='09' then 'Sep' " +
        "  when to_char(a.leave_date_from,'MM')='10' then 'Okt' " +
        "  when to_char(a.leave_date_from,'MM')='11' then 'Nov' " +
        "  when to_char(a.leave_date_from,'MM')='12' then 'Des' end ||' '||to_char(a.leave_date_from,'YYYY') ||' - '||  " +
        "  to_char(a.leave_date_to,'DD')||' '||  " +
        "  case when to_char(a.leave_date_to ,'MM')='01' then 'Jan' " +
        "  when to_char(a.leave_date_to,'MM')='02' then 'Feb' " +
        "  when to_char(a.leave_date_to,'MM')='03' then 'Mar' " +
        "  when to_char(a.leave_date_to,'MM')='04' then 'Apr' " +
        "  when to_char(a.leave_date_to,'MM')='05' then 'Mei' " +
        "  when to_char(a.leave_date_to,'MM')='06' then 'Jun' " +
        "  when to_char(a.leave_date_to,'MM')='07' then 'Jul' " +
        "  when to_char(a.leave_date_to,'MM')='08' then 'Ags' " +
        "  when to_char(a.leave_date_to,'MM')='09' then 'Sep' " +
        "  when to_char(a.leave_date_to,'MM')='10' then 'Okt' " +
        "  when to_char(a.leave_date_to,'MM')='11' then 'Nov' " +
        "  when to_char(a.leave_date_to,'MM')='12' then 'Des' end ||' '||to_char(a.leave_date_to,'YYYY')  " +
        '  as tgl_cuti, ' +
        "  to_char(a.working_date,'DD')||' '|| " +
        "  case when to_char(a.working_date ,'MM')='01' then 'Jan' " +
        "  when to_char(a.working_date,'MM')='02' then 'Feb' " +
        "  when to_char(a.working_date,'MM')='03' then 'Mar' " +
        "  when to_char(a.working_date,'MM')='04' then 'Apr' " +
        "  when to_char(a.working_date,'MM')='05' then 'Mei' " +
        "  when to_char(a.working_date,'MM')='06' then 'Jun' " +
        "  when to_char(a.working_date,'MM')='07' then 'Jul' " +
        "  when to_char(a.working_date,'MM')='08' then 'Ags' " +
        "  when to_char(a.working_date,'MM')='09' then 'Sep' " +
        "  when to_char(a.working_date,'MM')='10' then 'Okt' " +
        "  when to_char(a.working_date,'MM')='11' then 'Nov' " +
        "  when to_char(a.working_date,'MM')='12' then 'Des' end ||' '||to_char(a.working_date,'YYYY')  as tgl_kembali_kerja, " +
        '  reason as alasan_cuti, ' +
        "  to_char(a.request_date ,'DD')||' '|| " +
        "  case when to_char(a.request_date ,'MM')='01' then 'Jan' " +
        "  when to_char(a.request_date,'MM')='02' then 'Feb' " +
        "  when to_char(a.request_date,'MM')='03' then 'Mar' " +
        "  when to_char(a.request_date,'MM')='04' then 'Apr' " +
        "  when to_char(a.request_date,'MM')='05' then 'Mei' " +
        "  when to_char(a.request_date,'MM')='06' then 'Jun' " +
        "  when to_char(a.request_date,'MM')='07' then 'Jul' " +
        "  when to_char(a.request_date,'MM')='08' then 'Ags' " +
        "  when to_char(a.request_date,'MM')='09' then 'Sep' " +
        "  when to_char(a.request_date,'MM')='10' then 'Okt' " +
        "  when to_char(a.request_date,'MM')='11' then 'Nov' " +
        "  when to_char(a.request_date,'MM')='12' then 'Des' end ||' '||to_char(a.request_date,'YYYY')  as tgl_pengajuan, " +
        " case when a.state='Approved' then 'Disetujui' " +
        " when a.state='Rejected' then 'Ditolak' " +
        " when a.state='Submitted' then 'Menunggu Persetujuan' " +
        " when a.state='Cancelled' then 'Batal' " +
        ' end as Status,a.golid , a.request_days as cuti_diambil , ' +
        " a.employee_id||'/'||to_char(a.request_date,'YYYYMMDD')||'/'||trim(to_char(a.sequence_no,'9999999999999999')) as nobukti , " +
        " case when a.state='Approved' then 'Disetujui' " +
        " when a.state='Rejected' then 'Ditolak' " +
        " when a.state='Submitted' then 'Menunggu Persetujuan' " +
        " when a.state='Cancelled' then 'Batal' " +
        " end||' '||initcap(d.display_name) nama_penyetuju " +
        ' from leave_request_tbl a ' +
        " left join approval_structure_tbl b on a.golid = b.ref_id and b.template_name='APPROVAL LEAVE' " +
        ' left join employee_tbl  c on b.approver_id = c.employee_id  ' +
        ' left join person_tbl d on c.person_id =d.person_id  ' +
        " where a.employee_id = $1   and a.request_date between (current_date -interval '1 days' * $3 ) and now()  " +
        ' order by leave_date_from desc ' +
        ' LIMIT $2 ';

      await pool.db_MMFPROD
        .query(query, [employee_id, filter, waktu])
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
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
          throw error;
        });
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
