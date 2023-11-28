const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Authorization/auth');
const verifyToken = require('../Authorization/verifyToken');

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
    res.json(token);
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
  

module.exports = router;
