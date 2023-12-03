const express = require('express')
const https = require('https');
const fs = require('fs');

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/*app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})*/
// LISTENING PORT
const PORT = process.env.PORT || 8088;
https.createServer({
  key: fs.readFileSync('./cert/server.key'),
  cert: fs.readFileSync('./cert/server.cert')
}, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT} over HTTPS.`);
});

//module.exports = app