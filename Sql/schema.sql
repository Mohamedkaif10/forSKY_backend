-- Create the 'forsky' schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS forsky;

-- Set the search path to the 'forsky' schema
SET search_path TO forsky;

-- Now, create the 'users' table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_no VARCHAR(20) NOT NULL
);
