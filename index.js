const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./Components/person_tbl_api')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

// app.get('/birthDate', db.getBirthDate)
// app.get('/getBirthDate/:id', db.getBirthDatebyId)

//post get birthdate from DB
app.post('/getBirthDate', db.datePost)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})