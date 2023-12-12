const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Authorization/auth');
const verifyToken = require('../Authorization/verifyToken');
const { addAdditionalInfo,addprojects,scheduleInterview ,addjobDetails,addIdeas} = require('../functions/post');
const drive= require('../Config/gDriveConfig')
const multer = require('multer');
const storage = multer.memoryStorage(); 
const fs = require('fs');
const stream = require('stream');
const db = require('../Config/dbConnection');
const path = require('path');

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
    console.log('Login successful. Sending token:', token);
    res.status(200).json(token);
  } catch (error) {
    console.error(error);
    res.status(401).send(error.message);
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
      res.status(500).json({ error: error.message }); 
    }
  });
  router.post('/job-details', verifyToken, upload.single('pdf'), async (req, res) => {
    console.log("the ",req.file); 
    console.log(req.body)
    try {
     
      const { dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description } = req.body;
      const userId = req.user.id;
      const pdf_name = req.file.originalname;
      const serverFilePath = path.join(__dirname, '../pdfs', pdf_name);
  
      fs.writeFileSync(serverFilePath, req.file.buffer);
  
      const fileMetadata = {
        name: pdf_name,
        parents: ['1kcGDybGowsIlhR7ELUHjPUrZji1ckH32'],
      };
  
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
  
      const pdfId = driveRes.data.id;
  
      await addjobDetails(userId, dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, pdf_name, pdfId);
  
      fs.unlinkSync(serverFilePath);
  
      res.json({ success: true, message: 'Job details added', pdfId });
      res.status(200)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
router.post('/ideas',verifyToken,async(req,res)=>{
  try{
    const{title,stream,content}=req.body;
    const user_id = req.user.id;
    const result = await addIdeas(user_id,title,stream,content)
    res.status(200).json(result);
  }catch(error){
    console.error(error)
    res.status(500).send('Internal server error')
  }
})


module.exports = router
