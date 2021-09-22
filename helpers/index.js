/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
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
        console.log(response);
        break;
      case 'ERROR':
        console.error(response);
        break;
      default:
        break;
    }
  }

  static dataResponse(status = Number, data, validate_id) {
    if (status && data) {
      let message = '';

      switch (status) {
        case 200:
          message = 'SUCCESSFUL_REQUEST';
          break;
        case 201:
          message = 'SUCCESSFUL_CREATED';
          break;
        case 422:
          message = 'INVALID_REQUEST';
          break;
        case 404:
          message = 'NOT_FOUND';
          break;
        case 400:
          message = 'BAD_REQUEST';
          break;
        case 500:
          message = 'INTERNAL_SERVER_ERROR';
          break;
        default:
          return false;
      }

      const response = {
        status,
        message,
      };

      if (validate_id) response.validate_id = validate_id;
      response.data = data;
      return response;
    }

    return false;
  }
}

module.exports = Helpers;
