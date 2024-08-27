# Forsky(Backend)

Platform for job opening and hop posting

## Tech Stack

**Server:** Node, Express

**Database:** PostgreSql

**Cloud Service:** AWS

## Run Locally

Clone the project

```bash
  git clone https://github.com/Mohamedkaif10/forSKY_backend.git
```

Go to the project directory

```bash
  cd forSKY_backend
```

Install dependencies

```bash
  npm install
```

Set up your environment variables by creating a `.env` file in the root directory:

```bash
  touch .env
```

Add the following variables:

```bash
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=your-database-port
JWT_SECRET=your-jwt-secret
```

Start the server

```bash
  npm run dev
```

The server will run on `http://localhost:port`

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`AWS BUCKET NAME`

`AWS BUCKET REGION`

`AWS ACCESS KEY`

`AWS SECRET ACCESS KEY`

## API reference

## GET

#### GET `/subjects`

```http
  GET /subjects
```

| Parameter | Type | Description                            |
| :-------- | :--- | :------------------------------------- |
| None      |      | Retrieves all subjects ordered by name |

#### GET `/departments/:subjectId`

```http
  GET /departments/:subjectId
```

| Parameter   | Type      | Description                                                  |
| :---------- | :-------- | :----------------------------------------------------------- |
| `subjectId` | `integer` | **Required**. The ID of the subject to filter departments by |

#### GET `/get_job`

```http
  GET /get_job
```

| Parameter  | Type      | Description                                                 |
| :--------- | :-------- | :---------------------------------------------------------- |
| `page`     | `integer` | **Optional**. The page number to retrieve. Defaults to `1`  |
| `pageSize` | `integer` | **Optional**. The number of items per page. Defaults to `5` |

#### GET `/get-job-full`

```http
  GET /get-job-full
```

| Parameter | Type | Description                              |
| :-------- | :--- | :--------------------------------------- |
| None      |      | Retrieves all job details for admin view |

#### GET `/get-ideas`

```http
  GET /get-ideas
```

| Parameter | Type | Description         |
| :-------- | :--- | :------------------ |
| None      |      | Retrieves all ideas |

#### GET `/get-ideas/:id`

```http
  GET /get-ideas/:id
```

| Parameter | Type      | Description                                  |
| :-------- | :-------- | :------------------------------------------- |
| `id`      | `integer` | **Required**. The ID of the idea to retrieve |

#### GET `/ideasByStream/:stream`

```http
  GET /ideasByStream/:stream
```

| Parameter | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| `stream`  | `string` | **Required**. The stream to filter ideas by |

#### GET `/filtered-job-details`

```http
  GET /filtered-job-details
```

| Parameter         | Type      | Description                                         |
| :---------------- | :-------- | :-------------------------------------------------- |
| `location`        | `string`  | **Optional**. The location to filter jobs by        |
| `stipend_amount`  | `integer` | **Optional**. The stipend amount to filter jobs by  |
| `department_name` | `string`  | **Optional**. The department name to filter jobs by |
| `job_title`       | `string`  | **Optional**. The job title to filter jobs by       |

#### GET `/job-details/:userId`

```http
  GET /job-details/:userId
```

| Parameter | Type      | Description                                                  |
| :-------- | :-------- | :----------------------------------------------------------- |
| `userId`  | `integer` | **Required**. The ID of the user to retrieve job details for |

#### GET `/job_details/user`

```http
  GET /job_details/user
```

| Parameter | Type | Description                                  |
| :-------- | :--- | :------------------------------------------- |
| None      |      | Retrieves job details for the logged-in user |

#### GET `/admin/new`

```http
  GET /admin/new
```

| Parameter | Type | Description                       |
| :-------- | :--- | :-------------------------------- |
| None      |      | Retrieves newly added job details |

## POST

### Register User

```http
  POST /register
```

| Parameter   | Type     | Description                             |
| :---------- | :------- | :-------------------------------------- |
| `firstname` | `string` | **Required**. First name of the user    |
| `lastname`  | `string` | **Required**. Last name of the user     |
| `password`  | `string` | **Required**. Password for the account  |
| `email`     | `string` | **Required**. Email address of the user |
| `phone_no`  | `string` | **Required**. Phone number of the user  |

### Login User

```http
  POST /login
```

| Parameter  | Type     | Description                        |
| :--------- | :------- | :--------------------------------- |
| `email`    | `string` | **Required**. Email of the user    |
| `password` | `string` | **Required**. Password of the user |

### Add New Job Details (Authenticated)

```http
  POST /job-details-new
```

| Parameter        | Type     | Description                                         |
| :--------------- | :------- | :-------------------------------------------------- |
| `dept_name`      | `string` | **Required**. Department name                       |
| `job_title`      | `string` | **Required**. Job title                             |
| `stipend_amount` | `number` | **Required**. Stipend amount                        |
| `last_date`      | `string` | **Required**. Last date in ISO format               |
| `vacancies`      | `number` | **Required**. Number of vacancies                   |
| `location`       | `string` | **Required**. Job location                          |
| `scholar_link`   | `string` | **Required**. Link to the scholar's page            |
| `duration`       | `string` | **Required**. Duration of the job                   |
| `description`    | `string` | **Required**. Job description                       |
| `institute`      | `string` | **Required**. Name of the institute                 |
| `link`           | `string` | **Required**. Link to apply or get more information |

### Add Idea (Authenticated)

```http
  POST /ideas
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`   | `string` | **Required**. Title of the idea   |
| `stream`  | `string` | **Required**. Stream of the idea  |
| `content` | `string` | **Required**. Content of the idea |
| `image`   | `file`   | **Required**. Image file          |

### Bookmark Job (Authenticated)

```http
  POST /bookmark/${jobId}
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `jobId`   | `string` | **Required**. ID of the job to bookmark |

### Send OTP

```http
  POST /send-otp
```

| Parameter  | Type     | Description                            |
| :--------- | :------- | :------------------------------------- |
| `phone_no` | `string` | **Required**. Phone number to send OTP |

### Verify OTP

```http
  POST /verify-otp
```

| Parameter  | Type     | Description                              |
| :--------- | :------- | :--------------------------------------- |
| `phone_no` | `string` | **Required**. Phone number to verify OTP |
| `otp`      | `string` | **Required**. OTP to verify              |

### Register New Users

```http
  POST /newusers-register
```

| Parameter   | Type     | Description                             |
| :---------- | :------- | :-------------------------------------- |
| `firstname` | `string` | **Required**. First name of the user    |
| `lastname`  | `string` | **Required**. Last name of the user     |
| `password`  | `string` | **Required**. Password for the account  |
| `email`     | `string` | **Required**. Email address of the user |
| `phone_no`  | `string` | **Required**. Phone number of the user  |

### Register New Mentors

```http
  POST /newmentors-register
```

| Parameter   | Type     | Description                               |
| :---------- | :------- | :---------------------------------------- |
| `firstname` | `string` | **Required**. First name of the mentor    |
| `lastname`  | `string` | **Required**. Last name of the mentor     |
| `password`  | `string` | **Required**. Password for the account    |
| `email`     | `string` | **Required**. Email address of the mentor |
| `phone_no`  | `string` | **Required**. Phone number of the mentor  |

## Update

### Update Password

```http
PUT /update-password
```

| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `password` | `string` | **Required**. New password to set |

### Update Role Name

```http
PUT /update-role-name
```

| Parameter | Type     | Description                                        |
| :-------- | :------- | :------------------------------------------------- |
| `role`    | `string` | **Required**. New role to update                   |
| `email`   | `string` | **Required**. Email of the user to update the role |

## Used By

This project is used by the following companies:

- Tayog
