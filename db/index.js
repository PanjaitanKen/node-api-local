const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  host: '192.168.0.111',
  database: 'MMFPROD',
  password: 'Kutubuku123',
  port: 5433,
})

module.exports = {
    db
}