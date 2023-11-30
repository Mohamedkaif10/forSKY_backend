const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./Routes/router');
const getroutes =require('./Routes/router_2');
const app = express();
const PORT = process.env.PORT || 8002;

app.use(bodyParser.json());
app.use('/api', routes);
app.use('/api',getroutes)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
