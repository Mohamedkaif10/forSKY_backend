const express = require('express');
const router = express.Router();
const verifyToken = require('../Authorization/verifyToken');
const { getProjects,getFilteredJobDetails,getJobDetails,getIdeas,getIdeasByStream,getJobDetailsPage,getBookmarks,searchJobs,getIdeaById} = require('../functions/get');
const db=require('../Config/dbConnection')

router.get('/subjects', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM subjects ORDER BY name;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting subjects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/departments/:subjectId', async (req, res) => {
  const { subjectId } = req.params;
  try {
    const result = await db.query('SELECT * FROM departments WHERE subject_id = $1', [subjectId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting departments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
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
router.get('/get-ideas/:id', async (req, res) => {
  const ideaId = req.params.id;

  try {
    const idea = await getIdeaById(ideaId);

    if (idea) {
      res.json({ success: true, idea });
    } else {
      res.status(404).json({ error: 'Idea not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/user-profile', verifyToken, async (req, res) => {
  try {
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

router.get('/job-details/:userId',verifyToken, async (req, res) => {
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
  router.get('/bookmarks', verifyToken,async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you have user information in req.user
      const bookmarks = await getBookmarks(userId);
  
      res.json({ success: true, bookmarks });
    } catch (error) {
      console.error('Error in GET /bookmarks:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  router.get('/search', async (req, res) => {
    const { location, department_name } = req.query;

    // Validate that both location and department_name are provided
    if (!location && !department_name) {
        return res.status(400).json({ error: 'Both location and department_name are required.' });
    }

    try {
        const jobs = await searchJobs(location, department_name);

        // Check if the result array is empty
        if (jobs.length === 0) {
            return res.status(404).json({ error: 'No matching jobs found.' });
        }

        res.json(jobs);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/check-profile',verifyToken, async (req, res) => {
  try {
   
    const user_id = req.user.id; 
    const profileCheck = await db.query('SELECT profile_completed FROM user_profiles WHERE user_id = $1', [user_id]);

    if (profileCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const isProfileCompleted = profileCheck.rows[0].profile_completed;

    res.json({ profile_completed: isProfileCompleted });
  } catch (error) {
    console.error('Error checking profile status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
