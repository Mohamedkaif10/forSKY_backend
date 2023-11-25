const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'forsky',
  password: 'Mohamed2004',
  port: 5432,
});

pool.on('connect', () => {
    console.log('Connected to the database');
    
    const schemaPath = `${__dirname}/../SQL/schema.sql`;
    const schema = fs.readFileSync(schemaPath).toString();
    pool.query(schema)
      .then(() => console.log('Schema executed successfully'))
      .catch(err => console.error('Error executing schema:', err));
  });
  
  pool.on('error', (err) => {
    console.error('Database connection error:', err);
    process.exit(-1);
  });
  
  module.exports = pool;
