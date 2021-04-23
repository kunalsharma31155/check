require('../models/provider');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Provider = mongoose.model('Provider');
const fileUpload = require('../api/file-upload')
const {createProviderValidator, createProviderValidationResult} = require('../validators/createProviderValidation');


module.exports.createProvider =  async (req,res,next) => {
    try{
    let provider = await Provider.findOne({ $and: [ { firstName: req.body.firstName }, { lastName: req.body.lastName } ] });
    if(provider) return res.status(400).json({ type: "Invalid", msg: "provider is already created with this Name."});
    //file upload and get fileName
    // await fileUpload(req, res);
    // await createProviderValidator;
    // await createProviderValidationResult(req,res);
    // req.body.fileName = req.file != undefined ? req.file.filename : '';

    provider = new Provider(_.pick(req.body, ['firstName', 'lastName', 'providerTypes','userRole','providerEmail','providerLoginId','parentId']));
    await provider.save((err, doc) => {
        if(!err) {
           return res.status(200).send( [_.pick(provider, ['_id', 'firstName', 'lastName', 'providerTypes','userRole','providerEmail','providerLoginId','parentId']), {'success':true}]);
        }
        else {
            return next(err); }
    });
    }
    catch(ex){
       return  next(ex);
    }
}

module.exports.searchProviderByName =  async (req,res,next) => {
    try{
    let provider = await Provider.find({ $or: [ { firstName: new RegExp('^'+req.body.firstName, 'i')}, { lastName: new RegExp('^'+req.body.lastName, 'i') } ] }, {"password":0}).sort({firstName:1});
    if(!provider || provider.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Search Provider Not Available."});

    return res.status(200).json({success : true, providers : provider});
    }
    catch(ex){
        next(ex);
    }
}

module.exports.getAllProvider =  async (req,res,next) => {
    try{
    let provider = await Provider.find({}, {"password":0}).sort({firstName:1});
    if(!provider || provider.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Provider Not Available."});

    return res.status(200).json({success : true, providers : provider});
    }
    catch(ex){
        next(ex);
    }
}

module.exports.updateProvider =  async (req,res,next) => {
    try{
        const provider = await Provider.updateOne({_id:mongoose.Types.ObjectId(req.body.providerId)},{
            providerTypes : req.body.providerTypes,
            activeStatus: req.body.activeStatus,
            lastName: req.body.lastName
        });
        res.status(200).json({success : true});
        next();
    }
    catch(ex){
        next(ex);
    }
}