require('express-async-errors');
const bodyParser = require("body-parser");
const express = require('express');
const cors = require('cors');
var path = require( "path" );

const error = require('../middleware/error');
const user = require('../api/user.router');
const facility = require('../api/facility.router');
const patient = require('../api/patient.router');
const reports = require('../api/reports.router');
const provider = require('../api/provider.router');
const userAcess = require('../api/user-access.router');



module.exports = function(app){
    app.use(bodyParser.urlencoded({
        extended: true,limit: '25mb',parameterLimit:50000
    }));
    app.use(bodyParser.json({limit: '25mb'}));
    app.use(cors());
    app.use('/ab', express.static(path.resolve("./"+'../../')+'/upload/images'));
    app.use('/user', user);
    app.use('/facility', facility);
    app.use('/patient', patient);
    app.use('/report', reports);
    app.use('/provider', provider);
    app.use('/user-access',userAcess);
    app.use(error);
}