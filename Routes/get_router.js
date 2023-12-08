const express = require('express');
const router = express.Router();
const verifyToken = require('../Authorization/verifyToken');
const { getProjects,getFilteredJobDetails} = require('../functions/get');
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


module.exports = router;
