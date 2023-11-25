const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Authorization/auth');
const verifyToken = require('../Authorization/verifyToken');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await registerUser(username, password);
      res.json({ success: true, message: 'User added successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const token = await loginUser(username, password);
    res.json(token);
  } catch (error) {
    console.error(error);
    res.status(401).send(error.message);
  }
});

router.get('/user-profile', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
