const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

//parse requests of content-type - application/json
app.use(bodyParser.json());

//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: 'FoFiCiEf707PiGi', //TODO randomly generated in production
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: oneDay }
}));

require('./routes/app.routes')(app);
//404 handling
app.use((req, res) => {
  res.status(404).send({
    error: 'Resource not found',
    code: 'resourceNotFound'
  });
});
//error handling
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  return res.status(error.status || 500).send({
    error
  });
});


//launch server
const PORT = process.env.PORT || 8080;
https.createServer({
  key: fs.readFileSync('cert/server.key'),
  cert: fs.readFileSync('cert/server.cert')
}, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT} over HTTPS.`);
});
