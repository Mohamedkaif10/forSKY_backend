const express = require('express');
const router = express.Router();
const verifyToken = require('../Authorization/verifyToken');

const {unbookmarkJob}= require('../functions/delete')


router.delete('/bookmark/:jobId', async (req, res) => {
    try {
      const userId = 13; // Assuming you have user information in req.user
      const jobId = req.params.jobId;
  
      const result = await unbookmarkJob(userId, jobId);
  
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });


  module.exports = router;