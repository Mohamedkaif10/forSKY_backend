const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Authorization/auth');
const verifyToken = require('../Authorization/verifyToken');
const { addAdditionalInfo,addprojects,scheduleInterview ,addjobDetails,addIdeas,bookmarkJob} = require('../functions/post');
const drive= require('../Config/gDriveConfig')
const multer = require('multer');
const storage = multer.memoryStorage(); 
const fs = require('fs');
const stream = require('stream');
const db = require('../Config/dbConnection');
const path = require('path');
const {sendOTP,verifyOTP} = require('../functions/otp')
const upload = multer({ storage: storage });
const Jimp = require('jimp');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require('dotenv');
dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: process.env.BUCKET_REGION,
});

const uploads = multer({
  limits: {
    fileSize: 5000000, 
  },
});
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

router.post('/job-details', verifyToken, upload.single('pdf'), async (req, res) => {
  console.log("the ", req.file);
  console.log(req.body);

  try {
    const { dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, institute } = req.body;
    const userId = req.user.id;
    const pdf_name = req.file.originalname;

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

    await addjobDetails(userId, dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, pdf_name, pdfId, institute);

    res.json({ success: true, message: 'Job details added', pdfId });
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


router.post('/job-details-admin', upload.single('pdf'), async (req, res) => {
  console.log("the ", req.file);
  console.log(req.body);

  try {
    const { dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, institute } = req.body;
    const userId = 1;
    const pdf_name = req.file.originalname;

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

    await addjobDetails(userId, dept_name, job_title, stipend_amount, last_date, vacancies, location, scholar_link, duration, description, pdf_name, pdfId, institute);

    res.json({ success: true, message: 'Job details added', pdfId });
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


router.post('/ideas',verifyToken,uploads.single('image'),async(req,res)=>{
  try{
    const{title,stream,content}=req.body;
    const user_id = req.user.id;
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    const buffer = await Jimp.read(req.file.buffer)
  .then(image => {
    // Resize the image
    return image.resize(200, 100)
                .quality(90)   
                .getBufferAsync(Jimp.AUTO);
  })
    
    const params = {
      Bucket: bucketName,
      Key: req.file.originalname,
      Body: buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${req.file.originalname}`;
    const result = await addIdeas(user_id,title,stream,content,imageUrl)
    res.status(200).json(result);
  }catch(error){
    console.error(error)
    res.status(500).send('Internal server error')
  }
})


router.post('/bookmark/:jobId', verifyToken,async (req, res) => {
  try {
    const userId =req.user.id; // Assuming you have user information in req.user
    const jobId = req.params.jobId;

    const result = await bookmarkJob(userId, jobId);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
module.exports = router
