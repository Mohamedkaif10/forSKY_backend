const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_URL + "?sslmode=require",
})
  
  pool.on('error', (err) => {
    console.error('Database connection error:', err);
    process.exit(-1);
  });
  
  module.exports = pool;
