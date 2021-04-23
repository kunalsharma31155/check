require('../models/facility');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Facility = mongoose.model('Facility');
const PsychotropicData = mongoose.model('PsychotropicData');
const PostRoundData = mongoose.model('PostRoundData');
const {postRoundValidator, postRoundValidatorResult} = require('../validators/postRoundValidation');
const fileUpload = require('../api/file-upload');

module.exports.createFacility =  async (req,res,next) => {
    try{
    let facility = await Facility.findOne({ $or: [ { facilityEmail: req.body.facilityEmail }, { facilityLoginId: req.body.facilityLoginId } ] });
    if(facility) return res.status(400).json({ type: "Invalid", msg: "Facility is already created with this Email/LoginId."});

    facility = new Facility(_.pick(req.body, ['facilityName', 'facilityShortName', 'facilityLoginId', 'facilityEmail','partOfCorporate','nameOfCorporate', 'password', 'address','userRole','parentId']));
    const salt = await bcrypt.genSalt(10);

    await facility.save((err, doc) => {
        if(!err) {
            const token = jwt.sign({ _id: facility._id, status: facility.activeStatus }, process.env.JWT_PRIVATE_KEY,{ expiresIn : '2h'});
            const refreshToken = jwt.sign({ _id: facility._id}, process.env.REFRESH_TOKEN ,{ expiresIn : '1y'});
            res.status(200).header('x-auth-token',token).send( [_.pick(facility, ['_id', 'facilityName', 'facilityShortName', 'facilityLoginId', 'facilityEmail','partOfCorporate','nameOfCorporate','userRole', 'address', 'activeStatus','parentId']), {'success':true}]);
        }
        else {
            return next(err); }
    });
    }
    catch(ex){
        next(ex);
    }
}

module.exports.searchFacilityByName =  async (req,res,next) => {
    try{
    let facility = await Facility.find({ $or: [ { facilityName: new RegExp('^'+req.body.facilityName, 'i')}, { facilityShortName: new RegExp('^'+req.body.facilityShortName, 'i') } ] }, {"password":0}).sort({facilityName:1});
    if(!facility || facility.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Search Facility Not Available."});

    return res.status(200).json({success : true, facilities : facility});
    }
    catch(ex){
        next(ex);
    }
}

module.exports.getAllFacility =  async (req,res,next) => {
    try{
    let facility = await Facility.find({}, {"password":0}).sort({facilityName:1});
    if(!facility || facility.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Facility Not Available."});

    return res.status(200).json({success : true, facilities : facility});
    }
    catch(ex){
        next(ex);
    }
}

module.exports.updateFacility =  async (req,res,next) => {
    try{
        const facility = await Facility.updateOne({ facilityLoginId:req.body.facilityLoginId },{
            facilityShortName : req.body.facilityShortName,
            address : req.body.address,
            activeStatus: req.body.activeStatus,
            partOfCorporate: req.body.partOfCorporate,
            nameOfCorporate: req.body.nameOfCorporate
        });
        res.status(200).json({success : true});
        next();
    }
    catch(ex){
        next(ex);
    }
}

module.exports.psychotropicData =  async (req,res,next) => {
    const facility = await Facility.findById({'_id':req.body.facility});
    
    newPsychotropicData = new PsychotropicData(_.pick(req.body,['facility','facilityName','facilityDate','bedsInFacility',
    'censusPatients','patiensOnAntipsychotics','patiensOnAntiAnxiety','patientsOnAntiDepressants',
    'patientsOnSedativesHypnotics']));

    await facility.psychotropicData.push(newPsychotropicData);
    
    await facility.save((err, doc) => {
        if(!err) { 
            res.status(200).send(_.pick(newPsychotropicData,['facility','facilityName','facilityDate','bedsInFacility',
            'censusPatients','patiensOnAntipsychotics','patiensOnAntiAnxiety','patientsOnAntiDepressants',
            'patientsOnSedativesHypnotics']));
            next();
        }
        else {
            return next(err); }
    });
}

module.exports.postRoundData = async (req,res,next) => {
    await fileUpload(req, res)
    await postRoundValidator;
    await postRoundValidatorResult(req,res);
    const facility = await Facility.findById({'_id':req.body.facilityId});
    if(!facility || facility.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Facility Not Available."});

    if(req.file && req.file.filename) {
        req.body.uploadFilePath = req.file.filename
    }
    newPostRoundData = new PostRoundData(_.pick(req.body,['facilityId','providerId',
    'dateOfService', 'uploadFilePath']));

    await facility.postRoundData.push(newPostRoundData);

    await facility.save((err, doc) => {
        if(!err) {
            res.status(200).send(_.pick(newPostRoundData,['facilityId','providerId','dateOfService','uploadFilePath']));
            next();
        }
        else {
            return next(err); }
    });
}
module.exports.getCorporateFacility = async (req,res,next) => {
try{
    let facility = await Facility.find({'nameOfCorporate':req.params.name}, {"password":0}).sort({facilityName:1});
    if(!facility || facility.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Facility Not Available."});

    return res.status(200).json({success : true, facilities : facility});
    }
    catch(ex){
        next(ex);
    }
}