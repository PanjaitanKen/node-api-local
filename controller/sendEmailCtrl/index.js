var nodemailer = require('nodemailer');

var controller = {
  sendEmail: function (request, response) {
    let mailOptions = {
      from: userMail,
      to: email_to,
      cc: cc_to,
      subject: subject_email,
      text:
        'Cabang: ' +
        emp_cabang +
        '\n' +
        'Employee Id: ' +
        employee_id +
        '\n' +
        'Jabatan: ' +
        positionId +
        '-' +
        internalTitle +
        '\n' +
        'Tanggal: ' +
        day +
        '\n' +
        'Feedback: ' +
        information_data +
        '\n',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        const resp_api_email = info.response;
        pool.db_HCM.query(
          'UPDATE trx_komplain ' +
            'SET transfer_message = $1' +
            'WHERE tgl_komplain = $2',
          [resp_api_email, day],
          (error, results) => {
            if (error) {
              throw error;
            }
            response.status(200).send({
              status: 200,
              message: 'Berhasil mengirim email dan masuk kedalam tabel',
              data: '',
            });
          }
        );
      }
    });
  },
};

module.exports = controller;
