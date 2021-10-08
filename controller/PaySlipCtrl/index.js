/* eslint-disable no-plusplus */
/* eslint-disable object-curly-newline */
const PDFDocument = require('pdfkit');
const { default: axios } = require('axios');
const { validationResult } = require('express-validator');
const Helpers = require('../../helpers');

const controller = {
  createPayslip(request, response) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json(Helpers.dataResponse(422, errors));
    }

    const { employee_id, name, month, year, password, token } = request.body;

    Helpers.logger(
      'SUCCESS',
      { employee_id, name, month, year },
      'PaySlipCtrl.createPayslip'
    );

    try {
      // BEGIN Callback to ORANGE API
      axios
        .post(
          `${process.env.URL_ORANGE}/operation/api.payroll.PaySlipAPI/getAll`,
          JSON.stringify({
            dform0: { month, year, password, process_no: 'MMF^1' },
          }),
          {
            headers: {
              'x-orange-code': 'mfinhr19',
              'x-orange-clientid': 'feb3e17e2f06a8a80884c9214363f12c8892ffae',
              'x-orange-token': token,
            },
          }
        )
        .then(({ data }) => {
          const { records } = data;
          const { month, year, thp_amount } = records[0];
          const periode = `${month}-${year}`;
          let totalIncomeAmount = 0;
          let totalDeductionAmout = 0;

          // BEGIN Generate PDF
          const doc = new PDFDocument({ size: 'A4', userPassword: password });
          doc.fontSize(22).text('PaySlip', 25, 25);
          doc.fontSize(14).text('Employee ID', 25, 75);
          doc.fontSize(14).text(`: ${employee_id}`, 150, 75);
          doc.fontSize(14).text('Nama', 25, 95);
          doc.fontSize(14).text(`: ${name}`, 150, 95);
          doc.fontSize(14).text('Periode', 25, 115);
          doc.fontSize(14).text(`: ${periode}`, 150, 115);
          doc.image('assets/icons/icon-96.png', 470, 75);

          if (records.length > 0) {
            doc.lineJoin('miter').rect(25, 150, 540, 20).stroke();

            doc
              .lineCap('butt')
              .moveTo(25, 150)
              .lineTo(25, (180 * records.length) / 4.25)
              .stroke();

            doc
              .lineCap('butt')
              .moveTo(325, 150)
              .lineTo(325, (186 * records.length) / 4.25)
              .stroke();

            doc.fontSize(14).text('Komponen', 25, 155, { indent: 5 });

            doc
              .lineCap('butt')
              .moveTo(450, 150)
              .lineTo(450, (186 * records.length) / 4.25)
              .stroke();

            doc.fontSize(14).text('Penambah', 325, 155, { indent: 5 });

            doc
              .lineCap('butt')
              .moveTo(565, 150)
              .lineTo(565, (180 * records.length) / 4.25)
              .stroke();

            doc.fontSize(14).text('Pengurang', 450, 155, { indent: 5 });

            for (let i = 0; i < records.length; i++) {
              totalIncomeAmount += Number(records[i].income_amount);
              totalDeductionAmout += Number(records[i].deduction_amount);

              doc
                .lineCap('butt')
                .moveTo(565, 170 + i * 30)
                .lineTo(25, 170 + i * 30)
                .stroke();

              doc
                .fontSize(12)
                .text(records[i].description, 25, 180 + i * 30, { indent: 5 });

              doc
                .fontSize(12)
                .text(
                  new Intl.NumberFormat('id').format(records[i].income_amount),
                  325,
                  180 + i * 30,
                  {
                    indent: 5,
                  }
                );

              doc
                .fontSize(12)
                .text(
                  new Intl.NumberFormat('id').format(
                    records[i].deduction_amount
                  ),
                  450,
                  180 + i * 30,
                  {
                    indent: 5,
                  }
                );
            }

            doc
              .lineJoin('miter')
              .rect(25, (180 * records.length) / 4.25, 540, 20)
              .stroke();

            doc
              .fontSize(14)
              .text('Total', 25, (181.5 * records.length) / 4.25, {
                indent: 5,
              });

            doc
              .fontSize(14)
              .text(
                new Intl.NumberFormat('id').format(totalIncomeAmount),
                325,
                (181.5 * records.length) / 4.25,
                {
                  indent: 5,
                }
              );

            doc
              .fontSize(14)
              .text(
                new Intl.NumberFormat('id').format(totalDeductionAmout),
                450,
                (181.5 * records.length) / 4.25,
                {
                  indent: 5,
                }
              );
          }

          doc
            .fontSize(14)
            .text('Nilai Take Home Pay', 25, (195 * records.length) / 4.25);

          doc
            .fontSize(14)
            .text(
              new Intl.NumberFormat('id').format(thp_amount),
              325,
              (195 * records.length) / 4.25,
              { indent: 5 }
            );

          response.setHeader('Content-Type', 'application/pdf');

          response.setHeader(
            'Content-Disposition',
            `attachment; filename=payslip-${employee_id}-${month}-${year}.pdf`
          );

          doc.pipe(response);
          doc.end();
          // END Generate PDF //
        })
        .catch(({ response: { status, data } }) => {
          Helpers.logger(
            'ERROR',
            { employee_id, name, month, year },
            'PaySlipCtrl.createPayslip.callbackToOrange',
            JSON.stringify(data)
          );

          response.status(status).json(Helpers.dataResponse(status, data));
        });
      // END Callback to ORANGE API //
    } catch (error) {
      Helpers.logger(
        'ERROR',
        { employee_id, name, month, year },
        'PaySlipCtrl.createPayslip',
        error.message
      );

      response.status(500).json(Helpers.dataResponse(500, []));
    }
  },
};
module.exports = controller;
