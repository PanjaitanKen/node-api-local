const notifier = require('mail-notifier');

const controller = {
  mailNotifier(request, response) {
    try {
      console.log('tes');
      const imap = {
        user: 'panjaitankengkeng2@gmail.com',
        password: 'nandito101',
        host: 'imap.gmail.com',
        port: 993, // imap port
        tls: true, // use secure connection
        tlsOptions: { rejectUnauthorized: false },
      };

      const n = notifier(imap);
      n.on('end', () => n.start()) // session closed
        .on('mail', (mail) => console.log(mail.from[0].address, mail.subject))
        .start();
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
