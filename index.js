require('dotenv').config();

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
const cron = require('node-cron');

const Jobs = require('./jobs');
const app = require('./server');
const routes = require('./routes');

// start app
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

app.use((_, response, next) => {
  // allow access to https://cdn.jsdelivr.net
  response.setHeader(
    'Content-Security-Policy',
    "script-src 'unsafe-inline' https://cdn.jsdelivr.net"
  );
  next();
});

// enable files upload
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), { maxAge: 31557600 })
);

app.use(
  '/assets',
  express.static(path.join(__dirname, 'assets'), { maxAge: 31557600 })
);

app.use(
  fileUpload({
    createParentPath: true,
  })
);

// render for web static (html & css) with pug package
app.set('view engine', 'pug');

// app routes
app.get('/', (_, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

routes(app);

// Handling asynchronous error
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('global exception:', err.message);
});

// Handling rejected promises
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('unhandled promise rejection:', reason.message || reason);
});

// Schedule tasks to be run on the server.
if (cron.validate(process.env.SCHEDULE_CALON_KARYAWAN)) {
  cron.schedule(process.env.SCHEDULE_CALON_KARYAWAN, () => {
    Jobs.handleCalonKaryawan('PERSONNEL_ACQUISITION');
    Jobs.handleCalonKaryawan('NON_PERSONNEL_ACQUISITION');
  });
}

if (process.env.NODE_ENV === 'development') {
  cron.schedule('* * * * *', () => {
    Jobs.checkServiceHost();
  });

  cron.schedule('0 0 * * *', () => {
    Jobs.resetValueCheckServiceHostToZero();
  });
}

// app listen for api serv or api test
// for API
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}.`);
});

// for unit testing
// module.exports = app;
