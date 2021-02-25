const _ = require('lodash');
// eslint-disable-next-line no-unused-vars
const fileUpload = require('express-fileupload');

// Tabel : person_tbl, faskes_tbl, employee_tbl
const controller = {
  send_Doc_Psd(req, res) {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded',
        });
      } else {
        // eslint-disable-next-line no-lonely-if
        if (Array.isArray(req.files.docs)) {
          const data = [];

          // loop all files
          _.forEach(_.keysIn(req.files.docs), (key) => {
            const docs = req.files.docs[key];

            // move documents to uploads directory
            // eslint-disable-next-line prefer-template
            docs.mv('./uploads/dokumenPSD/' + docs.name);

            // push file details
            data.push({
              name: docs.name,
              mimetype: docs.mimetype,
              size: docs.size,
            });
          });

          // return response
          res.send({
            status: true,
            message: 'Files are uploaded',
            // eslint-disable-next-line object-shorthand
            data: data,
          });
        } else {
          // eslint-disable-next-line prefer-destructuring
          const docs = req.files.docs;

          // Use the mv() method to place the file in upload directory (i.e. "uploads")
          // eslint-disable-next-line prefer-template
          docs.mv('./uploads/dokumenPSD/' + docs.name);
          // send response
          res.send({
            status: true,
            message: 'File is uploaded',
            data: {
              name: docs.name,
              mimetype: docs.mimetype,
              size: docs.size,
            },
          });
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = controller;
