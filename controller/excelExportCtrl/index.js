const pool = require('../../db');
const excel = require('exceljs');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  excelExport(request, response) {
    try {
      const { tanggal } = request.body;
      let employee_id = [];

      pool.db_HCM.query(
        `select employee_code, menu, to_char(tanggal,'YYYY-MM-DD') tgl from trx_log_user
        where to_char(tanggal,'YYYY-MM-DD')=$1
        group by employee_code, menu, to_char(tanggal,'YYYY-MM-DD')
          `,
        [tanggal],
        (error, results) => {
          if (error) throw error;

          // eslint-disable-next-line eqeqeq
          if (results.rows != '') {
            employee_id = results.rows.map(function (a) {
              const id = a.employee_code;
              return id;
            });
            pool.db_MMFPROD.query(
              `select a.employee_id ,a.company_office ,c.display_name 
              from  emp_company_office_tbl  a
              left join employee_tbl b on a.employee_id =b.employee_id 
              left join person_tbl c on b.person_id  = c.person_id 
              where a.employee_id = ANY($1)
              and current_date between valid_from and valid_to
              order by company_office,display_name `,
              [employee_id],
              (error, results) => {
                if (error) throw error;

                // eslint-disable-next-line eqeqeq
                if (results.rows != '') {
                  let workbook = new excel.Workbook();
                  let worksheet = workbook.addWorksheet('User');
                  worksheet.columns = [
                    { header: 'Nokar', key: 'employee_id', width: 25 },
                    {
                      header: 'Kantor Cabang',
                      key: 'company_office',
                      width: 25,
                    },
                    { header: 'Nama', key: 'display_name', width: 25 },
                  ];

                  // Add Array Rows
                  worksheet.addRows(results.rows);
                  // res is a Stream object
                  response.setHeader(
                    'Content-Type',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  );
                  response.setHeader(
                    'Content-Disposition',
                    'attachment; filename=' + 'mandala.xlsx'
                  );

                  return workbook.xlsx.write(response).then(function () {
                    response.status(200).end();
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
