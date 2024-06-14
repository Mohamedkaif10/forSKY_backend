require('dotenv').config();

const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})
  //   const pool = new Pool({
  //   user: 'tayog_user',
  //   host: 'dpg-cpjb5gi1hbls73bt1ec0-a',
  //   database: 'tayog',
  //   password: 'OPQ2lA7aV3RTtHOQw1LnA4MNBejZO3KS',
  //   port: 5432,
  // });

  // pool.on('error', (err) => {
  //   console.error('Database connection error:', err);
  //   process.exit(-1);
  // });
  
  module.exports = pool;
