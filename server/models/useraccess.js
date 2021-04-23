const mongooose = require('mongoose');

const userAccessSchema = new mongooose.Schema({
    userRole: {
        type: String,
        required: true,
    },
    userRoleId: {
        type: String,
        required: true,
    },
    createSuperAdmin: {
        type: Boolean,
    },
    admin:{
        type: Boolean
    },
    dataentry:{
        type: Boolean
    },
    reports:{
        type: Boolean
    },
    createAdmin: {
        type: Boolean,
    },
    createOtherUser: {
        type: Boolean,
    },
    createFacility: {
        type: Boolean,
    },
    createPatient: {
        type: Boolean,
    },
    createProvider: {
        type: Boolean,
    },
    patientDataEntry: {
        type: Boolean,
    },
    postRoundingDataEntry: {
        type: Boolean,
    },
    facilityPsychotorpicNo: {
        type: Boolean,
    },
    providerPerformanceReportDetail: {
        type: Boolean,
    },
    briefProviderPerformanceReportDetail: {
        type: Boolean,
    },
    adminPriorAuthReport: {
        type: Boolean,
    },
    facilityPostRoundingReport: {
        type: Boolean,
    },
    facilityPsychotropicNumberReport: {
        type: Boolean,
    },
    billingCompanyPatientNotesReport: {
        type: Boolean,
    },
    facilitySnapSHotReport: {
        type: Boolean,
    },
    facilityPracticePerformanceReport: {
        type: Boolean,
    },
    powerOfAttorneyReport: {
        type: Boolean,
    },
    billingCompanyMissingDocumentsReport: {
        type: Boolean,
    },
    facilityDetailedGDRReport: {
        type: Boolean,
    },
    patientReport:{
        type: Boolean
    },
    patientSummaryReport:{
        type: Boolean
    },
    providerReport:{
        type: Boolean
    },
    facilityReport:{
        type: Boolean
    },
    adminReport:{
        type: Boolean
    }
},
{
    timestamps: true
})

const UserAccess = mongooose.model('UserAccess',userAccessSchema);