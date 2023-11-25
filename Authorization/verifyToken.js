const jwt = require('jsonwebtoken');
const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMDkwOTI1OSwiaWF0IjoxNzAwOTA5MjU4fQ.HVwsICuRlRh0DV9PK8IRVeqXFTA2IxKbkOzQBP_4-J4';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(403).send('Access denied.');

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send('Invalid token.');
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
