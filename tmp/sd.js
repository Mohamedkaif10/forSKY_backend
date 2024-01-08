const pool = new Pool({
    connectionString: process.env.POSTGRES_URL_URL + "?sslmode=require",
  })

  // const pool = new Pool({
  //   user: 'postgres',
  //   host: 'localhost',
  //   database: 'forsky',
  //   password: 'Mohamed2004',
  //   port: 5432,
  // });