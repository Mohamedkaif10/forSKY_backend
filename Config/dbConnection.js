require("dotenv").config();

const { Pool } = require("pg");
const fs = require("fs");

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
// })
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
  process.exit(-1);
});

module.exports = pool;
