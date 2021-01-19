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


// app.get('/birthDate', db.getBirthDate)
// app.get('/getBirthDate/:id', db.getBirthDatebyId)

//post get birthdate from DB
app.post('/getBirthDate', db.datePost)
//post get getCountJobTask from DB
app.post('/getCountJobTask', db.getCountJobTask)
//post get getListJobTask from DB
app.post('/getListJobTask', db.getListJobTask)
//post get getLongitude_Branch from DB
app.post('/getLongitude_Branch', db.getLongitude_Branch)
//post get image
app.post('/upload-avatar', img.uploadImage);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})