const express = require('express');
const router = express.Router();
const verifyToken = require('../Authorization/verifyToken');
const { getProjects,getFilteredJobDetails,getJobDetails} = require('../functions/get');
const db = require('../Config/dbConnection');
router.get('/get_job',async(req,res)=>{
    try{
        const result=await db.query('SELECT * FROM jobdetails');
        const postings=result.rows;
        res.json({success:true,postings});
    }catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
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

router.get('/projects', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await getProjects(userId);

    res.json({ success: true, projects });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/filtered-job-details', async (req, res) => {
  try {
    const filters = {
      location: req.query.location,
      stipend_amount: req.query.stipend_amount,
    };

    const jobDetails = await getFilteredJobDetails(filters);

    res.json({ success: true, jobDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/job-details/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Call the function to get job details by userId
      const userJobs = await getJobDetails(userId);
  
      // Check if jobs are found
      if (!userJobs || userJobs.length === 0) {
        return res.status(404).json({ error: 'No jobs found for the user' });
      }
  
      // Respond with the list of jobs
      res.status(200).json({ success: true, userJobs });
    } catch (error) {
      console.log(error)
      console.error('Error in GET /job-details/:userId:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;
