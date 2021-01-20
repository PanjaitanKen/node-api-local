const Pool = require('pg').Pool
const db_MMFPROD = new Pool({
  user: 'postgres',
  host: '192.168.0.111',
  database: 'MMFPROD',
  password: 'Kutubuku123',
  port: 5433,
})

const db_HCM = new Pool({
  user: 'postgres',
  host: '192.168.0.111',
  database: 'HCM',
  password: 'Kutubuku123',
  port: 5433,
})

module.exports = {
  db_MMFPROD,
  db_HCM
}