const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Authorization/auth');
const verifyToken = require('../Authorization/verifyToken');
const { addAdditionalInfo,addprojects,scheduleInterview } = require('../functions/post');
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
  

module.exports = router;
