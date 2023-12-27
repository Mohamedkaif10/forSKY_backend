const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const  drive = require('../Config/gDriveConfig');
const multer = require('multer');
const db = require('../Config/dbConnection');
const stream = require('stream');
const storage = multer.memoryStorage(); 
const {addImage}= require('../functions/post');
const verifyToken = require('../Authorization/verifyToken');
const upload = multer({ storage: storage });


router.post('/screenshot', upload.single('image'),verifyToken, async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const userId = req.user.id;
    const imageName = req.file.originalname;

    const fileMetadata = {
      name: imageName,
      parents: ['1Sp7UVR3bQ0PfGoFQz7AWVEmC_ruzwAmp'],
    };

    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    const media = {
      mimeType: req.file.mimetype,
      body: bufferStream,
    };

    const driveRes = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log('Google Drive API Request:', {
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log('Google Drive API Response:', driveRes);
    const imageId = driveRes.data.id;
    await addImage(userId, imageName, imageId);

    res.json({ success: true, message: 'Image uploaded to Google Drive', imageId });
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
  
module.exports = router;
