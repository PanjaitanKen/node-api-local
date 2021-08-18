const pool = require('../../db');
const axios = require('axios');

// Tabel : medical_benefit_info_tbl
const controller = {
  async getMedical_Info(request, response) {
    try {
      const { employee_id } = request.body;

      //insert log activity user -- start
      const data = {
        employee_id: employee_id,
        menu: 'Informasi Kesehatan',
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

      const query = `select employee_id,
        case when medical_type_name like '%RAWAT_INAP%' then 'Rawat Inap'
        when medical_type_name like '%RAWAT_JALAN%' then 'Rawat Jalan'
        when medical_type_name like '%KACAMATA%'  then 'Kacamata' else ' ' end
        as tipe_medical, total_benefit as plafond ,
        total_used_amount nilai_terpakai, total_benefit - total_used_amount sisa_plafond, golid
        from medical_benefit_info_tbl where employee_id = $1 and
        period_id=to_char(current_date,'YYYY') and total_benefit<>0`;

      await pool.db_MMFPROD
        .query(query, [employee_id])
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
