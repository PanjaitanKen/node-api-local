const { Pool } = require('pg');

const db_MMFPROD = new Pool({
  user: process.env.USER_MMFPROD || 'postgres',
  host: process.env.HOST_MMFPROD || '192.168.0.111',
  database: process.env.DATABASE_MMFPROD || 'MMFPROD',
  password: process.env.PASSWORD_MMFPROD || 'Kutubuku123',
  port: process.env.PORT_MMFPROD || 5433,
});

const db_HCM = new Pool({
  user: process.env.USER_HCM || 'postgres',
  host: process.env.HOST_HCM || '192.168.0.111',
  database: process.env.DATABASE_HCM || 'HCM',
  password: process.env.PASSWORD_HCM || 'Kutubuku123',
  port: process.env.PORT_HCM || 5433,
});

module.exports = {
  db_MMFPROD,
  db_HCM,
};
