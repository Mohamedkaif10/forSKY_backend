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
CREATE TABLE  IF NOT EXISTS jobdetails(
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  stipend_amount INT NOT NULL,
  last_date DATE NOT NULL,
  vacancies INT,
  location VARCHAR(100) NOT NULL,
  scholar_link VARCHAR(255),
  duration INT NOT NULL,
  description TEXT NOT NULL,
  pdf_name VARCHAR(255),
  pdf_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  stream VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  job_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (job_id) REFERENCES jobdetails(job_id)
);

CREATE TABLE IF NOT EXISTS screenshots (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    image_name VARCHAR(255) NOT NULL,
    image_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
);
Artificial Intelligence
Biomedical Engineering
Biotechnology
Chemical Engineering
Climate Change
Civil Engineering
Computer Science and Engineering
Electrical Engineering
Engineering Science
Heritage Science and Technology
Materials Science & Metallurgical...
Mechanical & Aerospace Engineering
Liberal Arts
Design
Entrepreneurship and Management
Chemistry
Physics
Mathematics



