var nodemailer = require('nodemailer');


var controller = {
  sendEmail: function (request, response) {
    let transporter = nodemailer.createTransport({
      // service: 'gmail',
      host: 'mail.mandalafinance.com',
      port: 587,
      secure: false, // use SSL
      auth: {
        user: 'mpower@mandalafinance.com',
        pass: 'MandalaHCM123'
      },
      tls:{
        rejectUnauthorized:false
      }
    });

    //untuk gmail, ada pengaturan tambahan, klik tautan berikut dan pilih yes : https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4MN8XIpiWqNLd6TaMwwGDnf5RBzKE34gCIha2_-D_QIUFiQcdq1alBxqA9L2GgH0_vAoHZhPewuIOdovF8VKGApG1oHHw

    let mailOptions = {
      from: 'mpower@mandalafinance.com',
      to: 'kenbagas@gmail.com',
      subject: 'Sending Email using Node.js',
      text: 'Hello World'
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        response.status(200).send({
          status: 200,
          message: 'Load Data berhasil',
          data: info.response
        });
      }
    });
  }
};

module.exports = controller;