const pool = require('../../db');

// Tabel : medical_benefit_info_tbl
const controller = {
  getMedical_Info(request, response) {
    try {
      const { employee_id } = request.body;

      pool.db_MMFPROD.query(
        `select employee_id,
        case when medical_type_name like '%RAWAT_INAP%' then 'Rawat Inap'
        when medical_type_name like '%RAWAT_JALAN%' then 'Rawat Jalan'
        when medical_type_name like '%KACAMATA%'  then 'Kacamata' else ' ' end
        as tipe_medical, total_benefit as plafond ,
        total_used_amount nilai_terpakai, total_benefit - total_used_amount sisa_plafond, golid
        from medical_benefit_info_tbl where employee_id = $1 and
        period_id=to_char(current_date,'YYYY') and total_benefit<>0`,
        [employee_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          if (results.rows !== '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: results.rows,
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
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
