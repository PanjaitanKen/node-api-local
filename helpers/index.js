const nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js');

class Helpers {
  static sendEmail(subject = '', text = '', to = '') {
    return new Promise((resolve, reject) => {
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

      transporter.sendMail(mailOptions, (error) => {
        if (error) reject(error);
        else resolve(true);
      });
    });
  }

  static encrypt(text = '') {
    return CryptoJS.AES.encrypt(text, process.env.API_KEY).toString();
  }

  static decrypt(text = '') {
    return CryptoJS.AES.decrypt(text, process.env.API_KEY).toString(
      CryptoJS.enc.Utf8
    );
  }

  static logger(
    status = '',
    payload = {},
    controller = '',
    description = 'HTTP Access Log'
  ) {
    const response = `${new Date().toString()} | ${status} | ${JSON.stringify(
      payload
    )} | ${controller} | ${description}`;

    switch (status) {
      case 'SUCCESS':
        // eslint-disable-next-line no-console
        console.log(response);
        break;
      case 'ERROR':
        // eslint-disable-next-line no-console
        console.error(response);
        break;
      default:
        break;
    }
  }
}

module.exports = Helpers;
