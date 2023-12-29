const pool = new Pool({
    connectionString: process.env.POSTGRES_URL_URL + "?sslmode=require",
  })