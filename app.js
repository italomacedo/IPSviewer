const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');

const index = fs.readFileSync('./ips_main.html', 'utf-8');
const favicon = fs.readFileSync('./favicon.ico');
const app = express();

let privateKey; 
let certificate;
let ca;
let credentials;
if  (fs.existsSync('./certs/ipsviewer2023.key') && fs.existsSync('./certs/ipsviewe2023r.crt') && fs.existsSync('./certs/ipsviewer2023.ca-bundle') ) {
  privateKey  = fs.readFileSync('./certs/ipsviewer2023.key', 'utf-8');
  certificate = fs.readFileSync('./certs/ipsviewer2023.crt', 'utf-8');
  ca = fs.readFileSync('./certs/ipsviewer2023.ca-bundle', 'utf-8')
  credentials = {key: privateKey, cert: certificate, ca: ca};
}


app.use('/templates', express.static('templates'));
app.use('/samples', express.static('samples'));
app.use('/assets', express.static('assets'));

app.get(['/favicon.ico'], (req, res) => {
  res.send(favicon);
});

app.get(['/', '/index.html'], (req, res) => {
    res.send(index);
});

app.get('*', (req, res) => {
  res.redirect('/');
});

var httpServer = http.createServer(app);
let httpsServer;
if (credentials) {
  httpsServer = https.createServer(credentials, app);
}

httpServer.listen(80);
if (httpsServer) {
  httpsServer.listen(443);
  console.log('listening on HTTP and HTTPS...')
}
else console.log('HTTPS server not running...')
