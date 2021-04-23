require('../models/user');
require('../models/facility');
require('../models/provider');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = mongoose.model('User');
const Provider = mongoose.model('Provider');
const Facility = mongoose.model('Facility');


module.exports.loginUser =  async (req,res,next) => {
    try{
        let user = await User.findOne({ $or: [ { email: req.body.email.toLowerCase() }, { userLoginId: req.body.email.toLowerCase() } ] });
        if(!user) {
            let facility = await Facility.findOne({ $or: [ { facilityEmail: req.body.email.toLowerCase() }, { facilityLoginId: req.body.email.toLowerCase() } ] });
            if(!facility) { return res.status(400).json({ type: "Not Found", msg: "Invalid  Email Or Password"}); }
            const validPassword = await bcrypt.compare(req.body.password, facility.password);
            if(!validPassword) return res.status(400).json({ type: "Not Found", msg: "Invalid Email Or Password" });

            if(facility.activeStatus == false) return res.status(400).json({ type: "Not Found", msg: "Account Disabled ! Contact Admin" });

            const token = jwt.sign({ _id: facility._id, status: facility.activeStatus,userRole: facility.userRole, email:facility.facilityEmail}, process.env.JWT_PRIVATE_KEY ,{ expiresIn : '2h'});
            const refreshToken = jwt.sign({ _id: facility._id}, process.env.REFRESH_TOKEN ,{ expiresIn : '1y'});
            res.status(200).json({success : true, token: token, refreshToken : refreshToken})
        } else {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(!validPassword) return res.status(400).json({ type: "Not Found", msg: "Invalid Email Or Password" });

            if(user.activeStatus == false) return res.status(400).json({ type: "Not Found", msg: "Account Disabled ! Contact Admin" });
            const token = jwt.sign({ _id: user._id ,userRole: user.userRole ,status: user.activeStatus,email:user.email,name:user.firstName,lastName:user.lastName}, process.env.JWT_PRIVATE_KEY ,{ expiresIn : '2h'});
            const refreshToken = jwt.sign({ _id: user._id ,userRole: user.userRole }, process.env.REFRESH_TOKEN ,{ expiresIn : '1y'});
            res.status(200).json({success : true, token: token, refreshToken : refreshToken})
        }
    }
    catch(ex){
        next(ex);
    }
}

module.exports.createUser =  async (req,res,next) => {
    try{
    let user;
    if(req.body.email == ""){
        user = await User.findOne({userLoginId: req.body.userLoginId});    
    }else{
    user = await User.findOne({ $or: [ { email: req.body.email }, { userLoginId: req.body.userLoginId } ] }); }
    if(user) return res.status(400).json({ type: "Invalid", msg: "User is already registered with this Email Or UserId."});
    
    user = new User(_.pick(req.body, ['firstName','lastName','userLoginId','email','password','userRole','activeStatus']));
    const salt = await bcrypt.genSalt(10);
    
    await user.save(async(err, doc) => {
        if(!err) {
            if(req.body.userRole == "facility"){
                facility = new Facility({
                parentId : user.id,
                facilityEmail : req.body.email,
                facilityName : req.body.firstName + " " + req.body.lastName,
                userRole :  req.body.userRole,
                activeStatus : req.body.activeStatus,
                facilityLoginId : req.body.userLoginId
            })
            await facility.save(async(err, doc) => {});
        }else if(req.body.userRole == "provider"){
                provider = new Provider({
                    parentId : user.id,
                    providerEmail : req.body.providerEmail,
                    userRole : req.body.userRole,
                    firstName : req.body.firstName + " " + req.body.lastName, 
                    activeStatus : req.body.activeStatus,
                    provideLoginId : req.body.userLoginId
                })
            
            await provider.save((err,doc) => {});
        }
            const token = jwt.sign({ _id: user._id ,userRole: user.userRole,status: user.activeStatus,name:user.firstName }, process.env.JWT_PRIVATE_KEY,{ expiresIn : '2h'});
            const refreshToken = jwt.sign({ _id: user._id ,userRole: user.userRole }, process.env.REFRESH_TOKEN ,{ expiresIn : '1y'});
            res.status(200).header('x-auth-token',token).send( [_.pick(user, ['_id','firstName','lastName','userLoginId','email','userRole','status']), {'success':true}]);
        }
        else {
            return next(err); 
        }
    });
    }
    catch(ex){
        next(ex);
    }
}

module.exports.searchUsersByName =  async (req,res,next) => {
    try{
    let user = await User.find({ $or: [ { firstName: new RegExp('^'+req.body.firstName, 'i')}, { lastName: new RegExp('^'+req.body.lastName, 'i') } ] }, {"password":0}).sort({firstName:1});
    if(!user || user.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Search User Not Available."});

    return res.status(200).json({success : true, users : user});
    }
    catch(ex){
        next(ex);
    }
}

module.exports.getAllUsers =  async (req,res,next) => {
    try{
    let user = await User.find({}, {"password":0}).sort({firstName:1});
    if(!user || user.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Users Not Available."});

    return res.status(200).json({success : true, users : user});
    }
    catch(ex){
        next(ex);
    }
}

module.exports.userUpdate =  async (req,res,next) => {
    try{
        if(req.body.userRole == "facility"){
            const facility = await Facility.updateOne({facilityLoginId: req.body.userLoginId},{
                facilityEmail : req.body.email,
                activeStatus : req.body.activeStatus
            })
        }else if(req.body.userRole == "provider"){
            const provider = await Provider.updateOne({provideLoginId: req.body.userLoginId},{
                providerEmail : req.body.email,
                activeStatus : req.body.activeStatus
            })
        }
        const user = await User.updateOne({ userLoginId: req.body.userLoginId},{
            userRole : req.body.userRole,
            email: req.body.email,
            activeStatus:req.body.activeStatus
        });
        res.status(200).json({success : true});
        next();
    }
    catch(ex){
        next(ex);
    }
}

module.exports.getCurrentUser =  async (req,res,next) => {
    const user = await User.findById(req.user._id).select('-password');
    if(!user) return res.status(400).json({ type: "Not Found", msg: "Not Found"});
    res.status(200).json({ success : true, userData : user });
    next();
}

module.exports.checkAdminPassword = async (req,res,next) =>{
    const user = await User.findOne({'_id':req.body.adminId});
    const validPassword = await bcrypt.compare(req.body.adminPassword, user.password);
    if(!validPassword){ return res.status(400).json({ type: "Not Found", msg: "Admin Password is Wrong !" }); }
    else{
        let pass="";
        let saltSecret="";
        let newPassword="";
        await bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(req.body.password, salt, async(err,hash) => {
                this.pass = hash;
                this.saltSecret = salt;
                userPassword = await User.updateOne({'_id':req.body.userId},{
                password : this.pass
            });
            })
        })
        return res.status(200).json({ status: true});
    }
}

module.exports.getCorporates = async (req,res,next) =>{
    const user = await User.find({'userRole':'facility-corporate'}).select('-password');
    if(!user) return res.status(400).json({ type: "Not Found", msg: "Not Found"});
    res.status(200).json({ success : true, userData : user });
    next();
}

