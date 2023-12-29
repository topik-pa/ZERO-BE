const express = require('express');
//const https = require('https');
//const fs = require('fs');
const http = require('http');
const session = require('express-session');
const path = require('path');

const app = express();

//parse requests of content-type - application/json
app.use(express.json());
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: 'FoFiCiEf707PiGi', //TODO randomly generated in production
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: oneDay }
}));


// set custom headers
app.use(function (req, res, next) {
  // HEADER HSTS
  res.setHeader('Strict-Transport-Security', 'max-age=999');
  next();
});

app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

app.set('view engine', 'pug');

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
//HTTPS
/*https.createServer({
  key: fs.readFileSync('cert/server.key'),
  cert: fs.readFileSync('cert/server.cert')
}, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT} over HTTPS.`);
});*/
//HTTP
http.createServer(app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
