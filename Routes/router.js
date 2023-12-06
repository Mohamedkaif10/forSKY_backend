const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Authorization/auth');
const verifyToken = require('../Authorization/verifyToken');
const { addAdditionalInfo,addprojects,scheduleInterview ,addjobDetails} = require('../functions/post');
const drive= require('../Config/gDriveConfig')
const multer = require('multer');
const storage = multer.memoryStorage(); 
const fs = require('fs');
const stream = require('stream');
const db = require('../Config/dbConnection');

const upload = multer({ storage: storage });
router.post('/register', async (req, res) => {
    const { firstname, lastname,  password, email, phone_no } = req.body;
  
    try {
      const user = await registerUser(firstname, lastname, password, email, phone_no);
      res.json({ success: true, message: 'User added successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

router.post('/login', async (req, res) => {
  const {email, password } = req.body;

  try {
    const token = await loginUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(401).send(error.message);
  }
});

router.get('/user-profile', verifyToken, async (req, res) => {
    try {
      // Assuming req.user contains the user information, including firstname
      console.log('User information:', req.user);
  
      const { firstname } = req.user;
      res.json({ user: { firstname } });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.post('/additional-info', verifyToken, async (req, res) => {
    try {
      const { department, specialization, researchAreas } = req.body;
      const userId = req.user.id; // Assuming req.user contains user information, including id
  
      const result = await addAdditionalInfo(userId, department, specialization, researchAreas);
  
      if (result.success) {
        res.status(201).json({ message: 'Interview scheduled successfully', result });
      } else {
        res.status(400).json({ message: 'Failed to schedule interview', error: result.error });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.post('/projects',verifyToken,async(req,res)=>{
    try {
        const{position,vacancy,pi,projectTitle,startDate,endDate}=req.body;
        const userId=req.user.id;
        const result = await addprojects(userId,position,vacancy,pi,projectTitle,startDate,endDate);
        res.json(result);
    } catch(error){
        console.error(error)
        res.status(500).send('Internal server error')
    }

    
  })
  router.post('/interview', verifyToken, async (req, res) => {
    try {
      const { date_interview, from_time, link } = req.body;
      const userId = req.user.id;
      const result = await scheduleInterview(userId, date_interview, from_time, link);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message }); // Respond with error details
    }
  });
 router.post('/job-details',verifyToken,async(req,res)=>{
  try {
    const {dept_name,job_title,stipend,last_date,vacancies,location,scholar_link,duration,description } = req.body;
    const userID = req.user.id;
    const job_result = await addjobDetails(userID,dept_name,job_title,stipend,last_date,vacancies,location,scholar_link,duration,description);
    res.json(job_result);
  } catch (error) {
    console.log(error)
    res.status(500).json({error:error.message})
  }
 })
  router.post('/upload', upload.single('pdf'), verifyToken, async (req, res) => {
    try {
      // Ensure that req.file.buffer is a Buffer
      if (!Buffer.isBuffer(req.file.buffer)) {
        throw new Error('req.file.buffer is not a valid Buffer.');
      }
  
      // Upload PDF to Google Drive
      
      const fileMetadata = {
        name: req.file.originalname, // Use the original name of the uploaded file
        parents: ['1kcGDybGowsIlhR7ELUHjPUrZji1ckH32'], // Replace with the ID of your Google Drive folder
      };
  
      // Convert buffer to readable stream
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);
  
      const media = {
        mimeType: 'application/pdf',
        body: bufferStream,
      };
  
      const driveRes = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });
  
      const fileId = driveRes.data.id;
      // Store PDF name and ID in the database
      await db.query('INSERT INTO pdfs (pdf_name, pdf_id, job_id) VALUES ($1, $2,$3)', [fileMetadata.name, fileId]);
  
      res.json({ success: true, fileId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
module.exports = router
