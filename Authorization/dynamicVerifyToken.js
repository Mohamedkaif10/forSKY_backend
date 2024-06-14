require('dotenv').config();

var { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require('jwks-rsa');
const jsonwebtoken = require('jsonwebtoken');

const jwksUriMap = {
  'https://accounts.google.com': 'https://www.googleapis.com/oauth2/v3/certs', // put for another provider
};

// Audience values for Google and GitHub
const audienceMap = {
  'https://accounts.google.com': process.env.GOOGLE_CLIENT_ID, // provide for other client id
};

// Middleware to dynamically select JWKS URI and audience based on issuer
const dynamicJwtCheck = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log("Authorization header missing")
    return res.status(401).json({ message: "Authorization header missing" });
  }

  let decoded;
  try {
    decoded = jsonwebtoken.decode(token, { complete: true });
  } catch (error) {
    console.error('Token cannot be decoded', error);
    return res.status(401).json({ message: "Token cannot be decoded" });
  }

  if (!decoded) {
    console.error('Token cannot be decoded');
    return res.status(401).json({ message: "Token cannot be decoded" });
  }

  const issuer = decoded.payload.iss;

  if (!jwksUriMap[issuer] || !audienceMap[issuer]) {
    console.error('Invalid token issuer');
    return res.status(401).json({ message: "Invalid token issuer" });
  }

  console.log(decoded)

  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: jwksUriMap[issuer]
    }),
    audience: audienceMap[issuer],
    issuer,
    algorithms: ['RS256']
  })(req, res, (req, res, (err) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded.payload; // Store the decoded token payload in req.user
    next();
  }));
};

module.exports = dynamicJwtCheck;
