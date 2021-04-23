const mongooose = require('mongoose');
const bcrypt = require('bcrypt');

const patientTestDataSchema = mongooose.Schema({
    parentId :{
        type: String
    },
    dateOfService:{
        type: Date
    },
    typeOfService:{
        type: String
    },
    patientFacility:{
        type: String
    },
    patientFacilityId: {
        type: String
    },
    patientProvider:{
        type: String
    },
    patientProviderId:{
        type: String
    },
    patientTrauma: {
        type: String
    },
    patientNewTrauma: {
        type: String
    },
    patientPainAssessment: {
        type: String
    },
    patientNewPainAssessment: {
        type: String
    },
    noGDR: {
        type: String
    },
    noGDRComment: {
        type: String
    },
    didGDR: {
        type: String
    },
    didGDRComment:{
        type: String
    },
    failedGDR: {
        type: String
    },
    failedGDRComment:{
        type: String
    },
    patientUnstableCheck:{
        type: String
    },
    patientUnstable: {
        type: String
    },
    patientUnstableMedCheck: {
        type: String
    },
    patientpsychotherapy: {
        type: String
    },
    patientAssessedCapacity : {
        type: String
    },
    patientAssessedCapacityComment : {
        type: String
    },
    patientMedChanges: {
        type: String
    },
    patientMedChangesCount: {
        type: String
    },
    patientSelectedMedChanges :{
        type: [{}]
    },
    patientSelectedMedChangesStart:{
        type: [{}]
    },
    patientSelectedMedChangesIncrease:{
        type: [{}]
    },
    patientSelectedMedChangesDecrease:{
        type: [{}]
    },
    patientSelectedMedChangesStop:{
        type: [{}]
    },
    patientDischargedPT: {
        type: String
    },
    patientDischargedComment: {
        type: String
    },
    patientPriorAuthCheck:{
        type: String
    },
    patientPriorAuth: {
        type: String
    },
    patientOrderedLabsCheck:{
        type: String
    },
    patientOrderedLabs: {
        type: String
    },
    patientPsychologicalTesting: {
        type: String
    },
    patientPsychologicalTestingName:{
        type: [{}]
    },
    patientPsychologicalTestingScore:{
        type: [{}]
    },
    performedCognitiveAssessmentTest:{
        type: String
    },
    performedCognitiveAssessmentTestName : {
        type: [{}]
    },
    performedCognitiveAssessmentTestScore:{
        type: [{}]
    },
    patientCorrectedDDXCheck:{
        type: String
    },
    patientCorrectedDDX:{
        type: String
    },
    patientReferToCheck:{
        type: String
    },
    patientReferTo:{
        type: String
    },
    patientDepressiveDisorderDx:{
        type: String
    },
    patientDepressiveDisorderDxDuration:{
        type:String
    },
    patientCognitiveImpairmentDx:{
        type: String
    },
    patientCognitiveImpairmentDxDuration:{
        type: String
    },
    initiatedBakerAct:{
        type: String
    },
    cptCode:{
        type: String
    },
    // started1to1Sitter:{
    //     type: String
    // },
    // removed1to1Sitter:{
    //     type:String
    // },
    startedOrRemoved1to1Sitter:{
        type: String
    },
    patientSummary:{
        type:String
    },
    savedByName:{
        type:String
    },
    savedById:{
        type:String
    },
    softDeleted:{
        type:String
    },
    sitter1to1:{
        type:String
    },
    document: {
        patientFacility: {
            type: String,
        },
        patientFacilityId: {
            type: String,
        },
        patientProvider: {
            type: String,
        },
        patientProviderId: {
            type: String,
        },
        uploadFilePath:{
            type:String
        },
        documentstatus:{
            type:String,
            default:'Submitted'
        },
        documentRemark:{
            type:String,
            default:''
        }
    }
},{
    timestamps: true
})

const PatientTestData = mongooose.model('PatientTestData',patientTestDataSchema);

const documentsSchema = mongooose.Schema({
    documentId: {
        type:String
    },
    uploadFilePath:{
        type:String
    },
    documentstatus:{
        type:String,
        default:'Submitted'
    },
    documentRemark:{
        type:String,
        default:''
    }
  },{
    timestamps: true
})

const UploadDocuments = mongooose.model('UploadDocuments',documentsSchema);


const patientSchema = new mongooose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 45
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 45
    },
    patientDOB: {
        type: Date,
        required: true
    },
    patientFacility: {
        type: String,
        required: true,
        maxlength: 255,
    },
    patientFacilityId: {
        type: String,
        required: true,
        maxlength: 255,
    },
    patientProvider: {
        type: String,
        required: true,
        maxlength: 255
    },
    patientProviderId: {
        type: String,
        required: true,
        maxlength: 255
    },
    powerOfAttorneyUserId:{
        type: String,
        maxlength: 255
    },
    activeStatus : {
        type : Boolean,
        default: true
    },
    documents : {
        type:[documentsSchema]
    },
    patientTestData : [patientTestDataSchema],
    dischargeReason:{
        type: String
    }
},
{
    timestamps: true
})

patientSchema.index({ firstName: 1 ,lastName:1,patientFacility:1,patientProvider:1,patientDOB:1});


const Patient = mongooose.model('Patient',patientSchema);