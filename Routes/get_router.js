const express = require('express');
const router = express.Router();
const verifyToken = require('../Authorization/verifyToken');
const { getProjects,getFilteredJobDetails,getJobDetails,getIdeas,getIdeasByStream,getJobDetailsPage,getBookmarks} = require('../functions/get');

router.get('/get_job', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 5;

    const jobDetails = await getJobDetailsPage (page, pageSize);

    res.json({ success: true, jobDetails, page, pageSize });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/get-ideas',async(req,res)=>{
  try{
    const ideas = await getIdeas();
    res.json({success:true,ideas})
  }catch(error){
    console.log(error);
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
      department_name:req.query.department_name,
      job_title:req.query.job_title,
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

  router.get('/ideasByStream/:stream', async (req, res) => {
    const stream = req.params.stream;
    try {
      const ideas = await getIdeasByStream(stream);
      res.status(200).json(ideas);
    } catch (error) {
      console.error('Error getting ideas by stream:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.get('/bookmarks', async (req, res) => {
    try {
      const userId = 13; // Assuming you have user information in req.user
      const bookmarks = await getBookmarks(userId);
  
      res.json({ success: true, bookmarks });
    } catch (error) {
      console.error('Error in GET /bookmarks:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

module.exports = router;
