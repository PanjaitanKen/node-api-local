var nodemailer = require('nodemailer');


var controller = {
  sendEmail: function (request, response) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'develop.hcm@gmail.com',
        pass: 'DEVHCM123'
      }
    });

    //untuk gmail, ada pengaturan tambahan, klik tautan berikut dan pilih yes : https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4MN8XIpiWqNLd6TaMwwGDnf5RBzKE34gCIha2_-D_QIUFiQcdq1alBxqA9L2GgH0_vAoHZhPewuIOdovF8VKGApG1oHHw

    let mailOptions = {
      from: '-',
      to: '-',
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