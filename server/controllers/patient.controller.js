require('../models/patient');
require('../models/requireddocument')
require('../models/cptcode');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Patient = mongoose.model('Patient');
const PatientTestData = mongoose.model('PatientTestData');
const UploadDocuments = mongoose.model('UploadDocuments');
const RequiredDocument = mongoose.model('RequiredDocument');
const CptCode = mongoose.model('CptCode');
const fileUploads = require('../api/multipal-file-upload');
const fileUpload = require('../api/file-upload');

const {createPatientValidator, createPatientValidationResult} = require('../validators/createPatientValidation');
const {updatePatientValidator, updatePatientValidationResult} = require('../validators/updatePatientValidation');

module.exports.createPatient =  async (req,res,next) => {
    try{
    await fileUploads(req, res);
    let patient = await Patient.findOne({ $and: [ { firstName: req.body.firstName }, { lastName: req.body.lastName }, { patientDOB: req.body.patientDOB } ] });
    if(patient) return res.status(400).json({ type: "Invalid", msg: "Patient is already created with this FirstName,LastName And DOB."});

    await createPatientValidator;
    await createPatientValidationResult(req, res);

    patient = new Patient(_.pick(req.body, ['firstName', 'lastName', 'patientDOB', 'patientFacility','patientFacilityId', 'patientProvider','patientProviderId','dischargeReason']));

    for(let index=0; index<req.files.length;index++){
        var fileName = req.files[index].filename != undefined ? req.files[index].filename : '';
        uploadDocuments = new UploadDocuments({
            documentId: req.body.fileName[index],
            uploadFilePath: fileName
        });
        await patient.documents.push(uploadDocuments);
    }

    const salt = await bcrypt.genSalt(10);

    await patient.save((err, doc) => {
        if(!err) {
            res.status(200).send( [_.pick(patient, ['_id', 'firstName', 'lastName', 'patientDOB', 'patientFacility', 'patientFacilityId','patientProvider','patientProviderId']), {'success':true}]);
        }
        else {
            return next(err); }
    });
    }
    catch(ex){
        next(ex);
    }
}

module.exports.searchPatientByName =  async (req,res,next) => {
    try{
    let patient = await Patient.find({ $or: [ { firstName: new RegExp('^'+req.body.firstName, 'i')}, { lastName: new RegExp('^'+req.body.lastName, 'i') } ] }, {"password":0});
    if(!patient || patient.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Search Patient Not Available."});

    return res.status(200).json({success : true, patients : patient});
    }
    catch(ex){
        next(ex);
    }
}

module.exports.getAllPatient =  async (req,res,next) => {
    try{
    const PAGE_SIZE = 10;                       // Similar to 'limit'
    const skip = (req.params.page - 1) * PAGE_SIZE;
    let p = await Patient.find({}).countDocuments();
    let patient = await Patient.find({}).sort({firstName:1}).skip(skip).limit(PAGE_SIZE);
    if(!patient || patient.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Patient Not Available."});

    return res.status(200).json({success : true, patients : patient,totalItems:p});
    }
    catch(ex){
        next(ex);
    }
}

module.exports.searchPatient = async (req,res,next) => {
    const PAGE_SIZE = 10;                       
    const skip = (req.params.page - 1) * PAGE_SIZE;
    const regex = new RegExp(req.params.search, 'i');
    let patient = await Patient.find({
        $or:[{'firstName':regex},{'lastName':regex},{'patientFacility':regex},{'patientProvider':regex}]
    }).sort({firstName:1}).skip(skip).limit(PAGE_SIZE);
    let p = await await Patient.find({
        $or:[{'firstName':regex},{'lastName':regex},{'patientFacility':regex},{'patientProvider':regex}]
    }).countDocuments();
    return res.status(200).json({success : true, patients : patient,totalItems:p});
}

module.exports.getAllRequiredDocument =  async (req,res,next) => {
    try{
    let requireddocument = await RequiredDocument.find({'activeStatus': true});
    if(!requireddocument || requireddocument.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Documents Not Available."});

    return res.status(200).json({success : true, documents : requireddocument});
    }
    catch(ex){
        next(ex);
    }
}

module.exports.updatePatient =  async (req,res,next) => {
    try{
        await fileUploads(req, res);
        await updatePatientValidator;
        await updatePatientValidationResult(req, res);
        const patient = await Patient.updateOne( { _id: mongoose.Types.ObjectId(req.body.patientId)}
        ,{$set:{
                patientFacility : req.body.patientFacility,
                patientProvider : req.body.patientProvider,
                patientFacilityId : req.body.patientFacilityId,
                patientProviderId : req.body.patientProviderId,
                powerOfAttorneyUserId : req.body.powerOfAttorneyUserId,
                activeStatus: req.body.activeStatus,
                dischargeReason: req.body.dischargeReason,
            }
        });
        if(req.files) {
            patientForDocument = await Patient.findOne( { _id: mongoose.Types.ObjectId(req.body.patientId)})
            for(let index=0; index<req.files.length;index++){
                var fileName = req.files[index].filename != undefined ? req.files[index].filename : '';
                uploadDocuments = new UploadDocuments({
                    documentId: req.body.fileName[index],
                    uploadFilePath: fileName
                });
                await patientForDocument.documents.push(uploadDocuments);
            }
            await patientForDocument.save((err, doc) => {
                if(!err) {
                    res.status(200).json({success : true, 'updated': true});
                }
                else {
                    return next(err); }
            });

        } else{
            res.status(200).json({success : true});
        }
        // next();
    }
    catch(ex){
        next(ex);
    }
}

module.exports.patientTestDetails =  async (req,res,next) => {
    await fileUpload(req, res);
    req.body.document = {};
    if(req.file && req.file.filename){
        req.body.document.uploadFilePath = req.file.filename;
        req.body.document.patientFacility = req.body.patientFacility;
        req.body.document.patientFacilityId = req.body.patientFacilityId;
        req.body.document.patientProvider = req.body.patientProvider;
        req.body.document.patientProviderId = req.body.patientProviderId
    }
    const patient = await Patient.findById({'_id':req.body.parentId});
    patient.patientFacility = req.body.patientFacility;
    patient.patientProvider = req.body.patientProvider;
    patient.patientFacilityId = req.body.patientFacilityId;
    patient.patientProviderId = req.body.patientProviderId;
    if(req.body.patientDischargedPT == "true"){
        patient.activeStatus = false;
    }
    testDetails = new PatientTestData(_.pick(req.body,['parentId','dateOfService','patientFacility','patientFacilityId','typeOfService','patientProvider','patientProviderId','patientTrauma','patientNewTrauma','patientPainAssessment','patientNewPainAssessment','noGDR','noGDRComment','didGDR','didGDRComment',
    'failedGDR','failedGDRComment','patientUnstable','patientUnstableMedCheck','patientpsychotherapy','patientAssessedCapacity','patientAssessedCapacityComment','patientMedChanges','patientMedChangesCount','patientSelectedMedChanges','patientSelectedMedChangesStart','patientSelectedMedChangesIncrease',
    'patientSelectedMedChangesDecrease','patientSelectedMedChangesStop','patientDischargedPT','patientDischargedComment','patientDischargedComment','patientPriorAuth','patientOrderedLabs','patientPsychologicalTesting','patientPsychologicalTestingName','patientPsychologicalTestingScore',
    'performedCognitiveAssessmentTest','performedCognitiveAssessmentTestName','performedCognitiveAssessmentTestScore','patientCorrectedDDX','patientReferTo','patientDepressiveDisorderDx','patientDepressiveDisorderDxDuration','patientCognitiveImpairmentDx',
    'patientCognitiveImpairmentDxDuration', 'initiatedBakerAct','cptCode','sitter1to1','patientUnstableCheck','patientOrderedLabsCheck','patientCorrectedDDXCheck','patientReferToCheck','patientPriorAuthCheck',
    'startedOrRemoved1to1Sitter','patientSummary','softDeleted','savedByName','savedById', 'document',]));

    await patient.patientTestData.push(testDetails);
    await patient.save((err, doc) => {
        if(!err) {
            res.status(200).send(_.pick(testDetails,['parentId','dateOfService','patientFacility','patientFacilityId','typeOfService','patientProviderId','patientProvider','patientTrauma','patientNewTrauma','patientPainAssessment','patientNewPainAssessment','noGDR','noGDRComment','didGDR','didGDRComment',
            'failedGDR','failedGDRComment','patientUnstable','patientUnstableMedCheck','patientpsychotherapy','patientAssessedCapacity','patientAssessedCapacityComment','patientMedChanges','patientMedChangesCount','patientSelectedMedChanges','patientSelectedMedChangesStart','patientSelectedMedChangesIncrease',
            'patientSelectedMedChangesDecrease','patientSelectedMedChangesStop','patientDischargedPT','patientDischargedComment','patientDischargedComment','patientPriorAuth','patientOrderedLabs','patientPsychologicalTesting','patientPsychologicalTestingName','patientPsychologicalTestingScore',
            'performedCognitiveAssessmentTest','performedCognitiveAssessmentTestName','performedCognitiveAssessmentTestScore','patientCorrectedDDX','patientReferTo','patientDepressiveDisorderDx','patientDepressiveDisorderDxDuration','patientCognitiveImpairmentDx',
            'patientCognitiveImpairmentDxDuration','initiatedBakerAct','cptCode','sitter1to1','patientUnstableCheck','patientOrderedLabsCheck','patientCorrectedDDXCheck','patientReferToCheck','patientPriorAuthCheck',
            'startedOrRemoved1to1Sitter','patientSummary','softDeleted','savedByName','savedById','_id']));
            next();
        }
        else {
            return next(err); }
    });
}

module.exports.updatePatientTestDetails =  async (req,res,next) => {
    const patient = await Patient.findOne({ _id: req.params.patientId})
    for(let i=0;i<patient.patientTestData.length;i++){
        if(patient.patientTestData[i]._id == req.params.visitId){
            patient.patientTestData[i].patientSelectedMedChanges = req.body.patientSelectedMedChanges;
            patient.patientTestData[i].patientSelectedMedChangesDecrease = req.body.patientSelectedMedChangesDecrease;
            patient.patientTestData[i].patientSelectedMedChangesIncrease = req.body.patientSelectedMedChangesIncrease;
            patient.patientTestData[i].patientSelectedMedChangesStart = req.body.patientSelectedMedChangesStart;
            patient.patientTestData[i].patientSelectedMedChangesStop = req.body.patientSelectedMedChangesStop;
            patient.patientTestData[i].patientPsychologicalTestingName = req.body.patientPsychologicalTestingName;
            patient.patientTestData[i].patientPsychologicalTestingScore = req.body.patientPsychologicalTestingScore;
            patient.patientTestData[i].performedCognitiveAssessmentTestName = req.body.performedCognitiveAssessmentTestName;
            patient.patientTestData[i].performedCognitiveAssessmentTestScore = req.body.performedCognitiveAssessmentTestScore;
            await patient.save((err, doc) => {
            if(!err) {
                res.status(200).send({'success':true});
            }
            else { return next(err); }
    });
        }
    }
}

module.exports.updatePatientVisitDetail = async (req,res,next) =>{
    await fileUpload(req, res);
    req.body.document = {};
    if(req.file && req.file.filename){
        req.body.document.uploadFilePath = req.file.filename;
        req.body.document.patientFacility = req.body.patientFacility;
        req.body.document.patientFacilityId = req.body.patientFacilityId;
        req.body.document.patientProvider = req.body.patientProvider;
        req.body.document.patientProviderId = req.body.patientProviderId
    }

    
    const patient = await Patient.findOne({ _id: req.params.patientId})

    patient.patientFacility = req.body.patientFacility;
    patient.patientProvider = req.body.patientProvider;
    patient.patientFacilityId = req.body.patientFacilityId;
    patient.patientProviderId = req.body.patientProviderId;
    if(req.body.patientDischargedPT == "true"){
        patient.activeStatus = false;
    }
    
    for(let i=0;i<patient.patientTestData.length;i++){
        if(patient.patientTestData[i]._id == req.params.visitId){

    patient.patientTestData[i].cptCode = req.body.cptCode;
    patient.patientTestData[i].dateOfService = req.body.dateOfService;
    patient.patientTestData[i].didGDR = req.body.didGDR;
    patient.patientTestData[i].didGDRComment = req.body.didGDRComment;
    patient.patientTestData[i].failedGDR = req.body.failedGDR;
    patient.patientTestData[i].failedGDRComment = req.body.failedGDRComment;
    patient.patientTestData[i].initiatedBakerAct = req.body.initiatedBakerAct;
    patient.patientTestData[i].noGDR = req.body.noGDR;
    patient.patientTestData[i].noGDRComment = req.body.noGDRComment;
    patient.patientTestData[i].patientAssessedCapacity = req.body.patientAssessedCapacity;
    patient.patientTestData[i].patientAssessedCapacityComment = req.body.patientAssessedCapacityComment;
    patient.patientTestData[i].patientCognitiveImpairmentDx = req.body.patientCognitiveImpairmentDx;
    patient.patientTestData[i].patientCognitiveImpairmentDxDuration = req.body.patientCognitiveImpairmentDxDuration;
    patient.patientTestData[i].patientCorrectedDDX = req.body.patientCorrectedDDX;
    patient.patientTestData[i].patientCorrectedDDXCheck = req.body.patientCorrectedDDXCheck;
    patient.patientTestData[i].patientDepressiveDisorderDx = req.body.patientDepressiveDisorderDx;
    patient.patientTestData[i].patientDepressiveDisorderDxDuration = req.body.patientDepressiveDisorderDxDuration;
    patient.patientTestData[i].patientDischargedComment = req.body.patientDischargedComment;
    patient.patientTestData[i].patientDischargedPT = req.body.patientDischargedPT;
    patient.patientTestData[i].patientFacility = req.body.patientFacility;
    patient.patientTestData[i].patientFacilityId = req.body.patientFacilityId;
    patient.patientTestData[i].patientMedChanges = req.body.patientMedChanges;
    patient.patientTestData[i].patientMedChangesCount = req.body.patientMedChangesCount;
    patient.patientTestData[i].patientNewPainAssessment = req.body.patientNewPainAssessment;
    patient.patientTestData[i].patientNewTrauma = req.body.patientNewTrauma;
    patient.patientTestData[i].patientOrderedLabs = req.body.patientOrderedLabs;
    patient.patientTestData[i].patientOrderedLabsCheck = req.body.patientOrderedLabsCheck;
    patient.patientTestData[i].patientPainAssessment = req.body.patientPainAssessment;
    patient.patientTestData[i].patientPriorAuth = req.body.patientPriorAuth;
    patient.patientTestData[i].patientPriorAuthCheck = req.body.patientPriorAuthCheck;
    patient.patientTestData[i].patientProvider = req.body.patientProvider;
    patient.patientTestData[i].patientProviderId = req.body.patientProviderId;
    patient.patientTestData[i].patientPsychologicalTesting = req.body.patientPsychologicalTesting;
    patient.patientTestData[i].patientReferTo = req.body.patientReferTo;
    patient.patientTestData[i].patientReferToCheck = req.body.patientReferToCheck;
    patient.patientTestData[i].patientSummary = req.body.patientSummary;
    patient.patientTestData[i].patientTrauma = req.body.patientTrauma;
    patient.patientTestData[i].patientUnstable = req.body.patientUnstable;
    patient.patientTestData[i].patientUnstableCheck = req.body.patientUnstableCheck;
    patient.patientTestData[i].patientUnstableMedCheck = req.body.patientUnstableMedCheck;
    patient.patientTestData[i].patientpsychotherapy = req.body.patientpsychotherapy;
    patient.patientTestData[i].performedCognitiveAssessmentTest = req.body.performedCognitiveAssessmentTest;
    patient.patientTestData[i].savedById = req.body.savedById;
    patient.patientTestData[i].savedByName = req.body.savedByName;
    patient.patientTestData[i].sitter1to1 = req.body.sitter1to1;
    patient.patientTestData[i].startedOrRemoved1to1Sitter = req.body.startedOrRemoved1to1Sitter;
    patient.patientTestData[i].typeOfService = req.body.typeOfService;
    patient.patientTestData[i].document = req.body.document;
            await patient.save((err, doc) => {
            if(!err) {
                res.status(200).send({'success':true});
            }
            else { return next(err); }
    });
        }
    }
}

module.exports.getPatientDetail =  async (req,res,next) => {
    let output=[];
    const patient = await Patient.findOne({ _id: req.params.id});
    if(!patient || patient.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "Patient Not Available."});
    for(let i=0;i<patient.patientTestData.length;i++){
        if(patient.patientTestData[i].softDeleted == "false"){
            output.push(patient.patientTestData[i]);
        }
    }
    return res.status(200).json({success : true, patient : output});
}

module.exports.getCptCode = async (req,res,next) => {
    const cpt = await CptCode.find({});
    if(!cpt || cpt.length === 0)
    return res.status(400).json({ type: "Not Found", msg: "CPT codes Not Available."});

    return res.status(200).json({success : true, cpt : cpt});
}

module.exports.deletePatientVisitDetail = async (req,res,next) => {
    const patient = await Patient.findOne({ _id: req.params.patientId})
    for(let i=0;i<patient.patientTestData.length;i++){
        if(patient.patientTestData[i]._id == req.params.visitId){
            patient.patientTestData[i].softDeleted = true;
            await patient.save((err, doc) => {
            if(!err) {
                res.status(200).send({'success':true});
            }
            else { return next(err); }
    });
        }
    }
}
