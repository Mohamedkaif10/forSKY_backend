const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./Routes/post_router');
const getroutes =require('./Routes/get_router');
const googleAuth = require('./Routes/googleRoute')
const passport =require('./Config/passport-config');
const delete_router=require('./Routes/delete_router')
const put_router=require('./Routes/put_router')
const drive_router= require('./Routes/GdriveRoute')
const aws_router=require('./Routes/awsRoute')
const app = express();
const cors = require("cors");
const session = require('express-session');
require('dotenv').config();
const PORT = process.env.PORT || 8002;
const secret = process.env.secretKey
app.use(session({ secret: secret, resave: true, saveUninitialized: true }));
app.use(bodyParser.json());
const corsOptions = {
  origin: ["https://forsync.vercel.app", "https://forsync-admin.vercel.app","https://tayog.vercel.app"],
  credentials: true,
};
app.use(cors(corsOptions));
passport.initialize()
app.use('/api', routes);
app.use('/api',getroutes);
app.use('/api',delete_router)
app.use('/',googleAuth);
app.use('/api',put_router)
app.use('/api',drive_router)
app.use('/api',aws_router)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
