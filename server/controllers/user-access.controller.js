require('../models/useraccess');
const mongoose = require('mongoose');
const UserAccess = mongoose.model('UserAccess');

module.exports.getAllUserAccess =  async (req,res,next) => {
    const userAccess = await UserAccess.find({});
    res.status(200).json({ success : true, result : userAccess });
    next();
}

module.exports.updateUserAccess = async (req,res,next) =>{
    const access = await UserAccess.updateOne({"userRoleId":req.body.userRoleId},{ $set: {
        createSuperAdmin : req.body.createSuperAdmin,
        createAdmin: req.body.createAdmin,
        admin:req.body.admin,
        dataentry:req.body.dataentry,
        reports:req.body.reports,
        createOtherUser: req.body.createOtherUser,
        createFacility: req.body.createFacility,
        createPatient: req.body.createPatient,
        createProvider: req.body.createProvider,
        patientDataEntry: req.body.patientDataEntry,
        postRoundingDataEntry: req.body.postRoundingDataEntry,
        facilityPsychotorpicNo: req.body.facilityPsychotorpicNo,
        providerPerformanceReportDetail: req.body.providerPerformanceReportDetail,
        briefProviderPerformanceReportDetail: req.body.briefProviderPerformanceReportDetail,
        adminPriorAuthReport: req.body.adminPriorAuthReport,
        facilityPostRoundingReport: req.body.facilityPostRoundingReport,
        facilityPsychotropicNumberReport: req.body.facilityPsychotropicNumberReport,
        billingCompanyPatientNotesReport: req.body.billingCompanyPatientNotesReport,
        facilitySnapSHotReport: req.body.facilitySnapSHotReport,
        facilityPracticePerformanceReport: req.body.facilityPracticePerformanceReport,
        powerOfAttorneyReport: req.body.powerOfAttorneyReport,
        billingCompanyMissingDocumentsReport: req.body.billingCompanyMissingDocumentsReport,
        facilityDetailedGDRReport: req.body.facilityDetailedGDRReport,
        patientReport: req.body.patientReport,
        patientSummaryReport: req.body.patientSummaryReport,
        providerReport:req.body.providerReport,
        facilityReport:req.body.facilityReport,
        adminReport:req.body.adminReport
    }});
    res.status(200).json({success : true});
}

module.exports.getSpecificUserAccess =  async (req,res,next) => {
    const userAccess = await UserAccess.findOne({"userRole":req.params.role});
    res.status(200).json({ success : true, result : userAccess });
    next();
}

