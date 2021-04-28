const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const fs = require('fs');
require('./config/config');
require('./startup/prod') (app);
require('./models/db');

require('./startup/routes') (app);
const httpsOptions = {
    cert : fs.readFileSync('./ssl/adminbalancedwellbeing.com.crt','utf8'),
    ca:fs.readFileSync('./ssl/adminbalancedwellbeing.com.ca-bundle','utf8'),
    key:fs.readFileSync('./ssl/adminbalancedwellbeing_com_key.txt','utf8')
}
console.log(httpsOptions.cert);
const httpsServer = https.createServer(httpsOptions, app);

// app.listen( process.env.PORT,err=>{
//     if(err){console.log(err);}
//     console.log(`Server Started On Port : ${process.env.PORT}`);
// })
https.createServer(httpsOptions, app).listen(process.env.PORT,err=>{
        if(err){console.log(err);}
        console.log(`Server Started On Port : ${process.env.PORT}`);
    });
