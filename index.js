require('dotenv').config();

// const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const https = require('https');

// const img = require('./Components/images_api');
// const db = require('./Components/MMF_api');
const routes = require('./routes');

// start app
const app = express();
const port = process.env.PORT || 3000;

// increase max sockets
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

// gzip compression
const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) return false;
  return compression.filter(req, res);
};

app.use(
  compression({
    filter: shouldCompress,
    threshold: 0,
  })
);

// add other middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// enable files upload
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), { maxAge: 31557600 })
);

app.use(
  fileUpload({
    createParentPath: true,
  })
);

// app routes
app.get('/', (_, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

routes(app);

// Handling asynchronous error
process.on('uncaughtException', (err) => {
  console.error('global exception:', err.message);
});

// Handling rejected promises
process.on('unhandledRejection', (reason) => {
  console.error('unhandled promise rejection:', reason.message || reason);
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
