CREATE SCHEMA IF NOT EXISTS forsky;

-- Set the search path to the 'forsky' schema
SET search_path TO forsky;
DROP TABLE IF EXISTS projects CASCADE;
DROP SEQUENCE IF EXISTS projects_id_seq;

CREATE SEQUENCE projects_id_seq;
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255) ,
  lastname VARCHAR(255),
  password VARCHAR(255),
  email VARCHAR(255),
  phone_no VARCHAR(20),
  google_id VARCHAR(50),
  display_name VARCHAR(50)
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
  job_id SERIAL PRIMARY KEY,
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
  institute VARCHAR(255) NOT NULL,
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
  imageUrl varchar(255),
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
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  work_status VARCHAR(50) NOT NULL,
  present_location VARCHAR(255),
  description TEXT,
  user_id INTEGER NOT NULL,
  profile_completed BOOL DEFAULT FALSE,
  image_url TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT email_unique UNIQUE (email),
  CONSTRAINT mobile_number_unique UNIQUE (mobile_number)
);


CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subject_id INT,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
CREATE TABLE otps (
  email VARCHAR(50) NOT NULL,
  otp VARCHAR(20) NOT NULL,
  user_id INT NOT NULL,
   FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE  IF NOT EXISTS jobdetailsnew(
  job_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  stipend_amount INT NOT NULL,
  last_date DATE,
  vacancies VARCHAR(255),
  location VARCHAR(255),
  scholar_link VARCHAR(255),
  duration VARCHAR(255),
  description TEXT,
  link TEXT,
  institute VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS new_users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255) ,
  lastname VARCHAR(255),
  password VARCHAR(255),
  email VARCHAR(255),
  phone_no VARCHAR(20),
  google_id VARCHAR(50),
  display_name VARCHAR(50),
  role 
);