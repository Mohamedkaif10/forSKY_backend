const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require('dotenv');
const { Router } = require('express');
const multer = require('multer');
const verifyToken = require("../Authorization/verifyToken");
const router = Router();
const db= require('../Config/dbConnection')
const Jimp = require('jimp');
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

const upload = multer({
  limits: {
    fileSize: 5000000, 
  },
});

router.post('/create-profile',verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { full_name, email, mobile_number, work_status, present_location, description } = req.body;

    // Extract user_id from the authenticated user
    const user_id =req.user.id;

    // Check if the user has already completed their profile
    const profileCheck = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [user_id]);

    if (profileCheck.rows.length != 0) {
      return res.status(400).json({ error: 'User profile already exists.' });
    }

    // Handle image upload
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
  .catch(error => {
    console.error('Error processing image with Jimp:', error);
    throw error;
  });
    const params = {
      Bucket: bucketName,
      Key: req.file.originalname,
      Body: buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${req.file.originalname}`;

    // Insert the new profile and set profile_completed to true and image_url
    const result = await db.query(
      'INSERT INTO user_profiles (full_name, email, mobile_number, work_status, present_location, description, user_id, profile_completed, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8) RETURNING *',
      [full_name, email, mobile_number, work_status, present_location, description, user_id, imageUrl]
    );

    res.json({ success: true, profile: result.rows[0] });
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/user-profile',verifyToken, async (req, res) => {
  try {
    // Extract user_id from the authenticated user
    const user_id = req.user.id;  // Change this to extract user_id from your authentication mechanism

    // Retrieve the user profile
    const profileResult = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [user_id]);

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const userProfile = profileResult.rows[0];

    res.json({ success: true, profile: userProfile });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/user-profile-image',verifyToken, async (req, res) => {
  try {
    // Extract user_id from the authenticated user
    const user_id = req.user.id;  // Change this to extract user_id from your authentication mechanism

    // Retrieve the user profile
    const profileResult = await db.query('SELECT image_url FROM user_profiles WHERE user_id = $1', [user_id]);

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const { image_url } = profileResult.rows[0];

    res.json({ success: true, image_url });
  } catch (error) {
    console.error('Error retrieving user profile image URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router