CREATE SCHEMA IF NOT EXISTS forsky;

-- Set the search path to the 'forsky' schema
SET search_path TO forsky;
DROP TABLE IF EXISTS projects CASCADE;
DROP SEQUENCE IF EXISTS projects_id_seq;

CREATE SEQUENCE projects_id_seq;
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_no VARCHAR(20) NOT NULL
);
CREATE TABLE IF NOT EXISTS additional (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  department VARCHAR(255),
  specialization VARCHAR(255),
  research_areas TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS projects (
    id INT DEFAULT nextval('projects_id_seq'::regclass) PRIMARY KEY,
    user_id INT NOT NULL,
    position VARCHAR(255),
    vacancy INT NOT NULL,
    pi VARCHAR(255) ,
    project_title VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS interview(
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  date_interview DATE NOT NULL,
  from_time  TIME NOT NULL, 
  link VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS postings(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  pdate DATE NOT NULL,
  no_of_applicants INT NOT NULL,
  location VARCHAR(20) NOT NULL,
  stipend VARCHAR(20) NOT NULL,
  dept VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  last_date DATE NOT NULL
  );

CREATE TABLE IF NOT EXISTS jobDetails (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  department_name VARCHAR(255),
  job_title VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS pdfs (
  id SERIAL PRIMARY KEY,
  pdf_name VARCHAR(255) NOT NULL,
  pdf_id VARCHAR(255) NOT NULL,
  job_id INT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobDetails(id) ON DELETE CASCADE
);
ALTER TABLE jobDetails
ADD COLUMN stipend_amount INT NOT NULL,
ADD COLUMN last_date DATE NOT NULL,
ADD COLUMN vacancies INT,
ADD COLUMN location VARCHAR(100) NOT NULL,
ADD COLUMN scholar_link VARCHAR(255),
ADD COLUMN duration INT NOT NULL,
ADD COLUMN description TEXT NOT NULL;





