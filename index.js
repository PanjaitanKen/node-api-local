const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./Components/MMF_api')
const img = require('./Components/images_api')
const fileUpload = require('express-fileupload');
//start app 
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const _ = require('lodash');
const cors = require('cors');

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));


const routes = require('./routes');
routes(app);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})