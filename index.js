const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./Routes/router');
const getroutes =require('./Routes/router_2');
const googleAuth = require('./Routes/googleRoute')
const passport =require('./Config/passport-config')
const app = express();
const session = require('express-session');
require('dotenv').config();
const PORT = process.env.PORT || 8002;
const secret = process.env.secretKey
app.use(session({ secret: secret, resave: true, saveUninitialized: true }));
// console.log(secret)
app.use(bodyParser.json());
passport.initialize()
app.use('/api', routes);
app.use('/api',getroutes);
app.use('/',googleAuth)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
