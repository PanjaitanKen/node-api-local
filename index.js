require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const https = require('https');

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
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

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

// app listen for api serv or api test
// for API
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}.`);
});

// for unit testing
// module.exports = app;
