const nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js');

class Helpers {
  static sendEmail(subject = '', text = '', to = '') {
    const hostMail = 'smtp.gmail.com';
    const userMail = 'mmf.hcm.alert@gmail.com';
    const passwordMail = 'yquszgbhtqnylstq';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: hostMail,
      auth: {
        user: userMail,
        pass: passwordMail,
      },
    });

    const mailOptions = {
      from: userMail,
      to,
      subject,
      text,
    };

    transporter.sendMail(mailOptions);
  }

  static encrypt(text = '') {
    return CryptoJS.AES.encrypt(text, process.env.API_KEY).toString();
  }

  static decrypt(text = '') {
    return CryptoJS.AES.decrypt(text, process.env.API_KEY).toString(
      CryptoJS.enc.Utf8
    );
  }
}

module.exports = Helpers;
