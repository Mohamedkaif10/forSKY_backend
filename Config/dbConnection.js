const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'forsky',
  password: 'Mohamed2004',
  port: 5432,
});
  
  pool.on('error', (err) => {
    console.error('Database connection error:', err);
    process.exit(-1);
  });
  
  module.exports = pool;
