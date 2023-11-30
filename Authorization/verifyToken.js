const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.secretKey;
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(403).send('Access denied.');

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(403).send('Invalid Token');
    }

    console.log('Decoded user:', user);

    req.user = user;
    next();
  });
}

module.exports = verifyToken;
