const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

//parse requests of content-type - application/json
app.use(bodyParser.json());

require('./routes/app.routes')(app);
app.get('/', (req, res) => {
  res.send('Hello World!');
});


// LISTENING PORT
const PORT = process.env.PORT || 8080;
https.createServer({
  key: fs.readFileSync('cert/server.key'),
  cert: fs.readFileSync('cert/server.cert')
}, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT} over HTTPS.`);
});
