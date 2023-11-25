const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./Routes/router');

const app = express();
const PORT = process.env.PORT || 8002;

app.use(bodyParser.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
