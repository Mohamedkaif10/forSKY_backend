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

  // router.post('/job-details-admin', upload.single('pdf'), async (req, res) => {
//   console.log("the ", req.file);
//   console.log(req.body);

//   try {
//     const { dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, institute } = req.body;
//     const userId = 1;
//     const pdf_name = req.file.originalname;

//     const fileMetadata = {
//       name: pdf_name,
//       parents: ['1kcGDybGowsIlhR7ELUHjPUrZji1ckH32'],
//     };

//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(req.file.buffer);

//     const media = {
//       mimeType: 'application/pdf',
//       body: bufferStream,
//     };

//     const driveRes = await drive.files.create({
//       resource: fileMetadata,
//       media: media,
//       fields: 'id',
//     });

//     const pdfId = driveRes.data.id;

//     await addjobDetails(userId, dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, pdf_name, pdfId, institute);

//     res.json({ success: true, message: 'Job details added', pdfId });
//     res.status(200);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });


// router.post('/job-details', verifyToken, async (req, res) => {
//   console.log(req.body);

//   try {
//     const { dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, institute,link } = req.body;
//     const userId = req.user.id;

//     await addjobDetails(userId, dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description,  institute,link);

//     res.json({ success: true, message: 'Job details added', pdfId });
//     res.status(200);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });




// router.post('/job-details', verifyToken, upload.single('pdf'), async (req, res) => {
//   console.log("the ", req.file);
//   console.log(req.body);

//   try {
//     const { dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, institute } = req.body;
//     const userId = req.user.id;
//     const pdf_name = req.file.originalname;

//     const fileMetadata = {
//       name: pdf_name,
//       parents: ['1kcGDybGowsIlhR7ELUHjPUrZji1ckH32'],
//     };

//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(req.file.buffer);

//     const media = {
//       mimeType: 'application/pdf',
//       body: bufferStream,
//     };

//     const driveRes = await drive.files.create({
//       resource: fileMetadata,
//       media: media,
//       fields: 'id',
//     });

//     const pdfId = driveRes.data.id;

//     await addjobDetails(userId, dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, pdf_name, pdfId, institute);

//     res.json({ success: true, message: 'Job details added', pdfId });
//     res.status(200);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });



// const addjobDetails = async (userID, dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, pdf_name, pdf_id,institute) => {
//   try {
//     const insertResult = await db.query('INSERT INTO jobdetails(user_id,department_name,job_title,stipend_amount,last_date,vacancies,location,scholar_link,duration,description,pdf_name,pdf_id,institute) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
//       [userID, dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, pdf_name, pdf_id,institute]
//     );

//     console.log(insertResult);

//     if (insertResult.rowCount > 0) {
//       return { success: true, message: "Job details added" };
//     } else {
//       throw new Error('Failed to add job details');
//     }
//   } catch (error) {
//     console.error(error);
//     throw new Error('Internal Server Error');
//   }
// };