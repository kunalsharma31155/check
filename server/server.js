const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
require('./config/config');
require('./startup/prod') (app);
require('./models/db');

require('./startup/routes') (app);
// const httpsOptions = {
//     cert : fs.readFileSync('./ssl/adminbalancedwellbeing.com.crt','utf8'),
//     ca:fs.readFileSync('./ssl/adminbalancedwellbeing.com.ca-bundle','utf8'),
//     key:fs.readFileSync('./ssl/adminbalancedwellbeing_com.key','utf8')
// }

const httpServer = http.createServer(app);
// const httpsServer = https.createServer(httpsOptions, app);

httpServer.listen( process.env.PORT,err=>{
    if(err){console.log(err);}
    console.log(`Http Server Started On Port : ${process.env.PORT}`);
})

// httpsServer.listen(process.env.PORT_HTTPS, err=>{
//     if(err){console.log(err);}
//     console.log(`Https Server Started On Port : ${process.env.PORT_HTTPS}`);
// });
