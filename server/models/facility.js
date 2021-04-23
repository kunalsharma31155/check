const mongooose = require('mongoose');
const bcrypt = require('bcrypt');

const psychotropicDataSchema = new mongooose.Schema({
    facility:{
        type: String
    },
    facilityName:{
        type: String
    },
    facilityDate:{
        type: String
    },
    bedsInFacility:{
        type: String
    },
    censusPatients:{
        type: String
    },
    patiensOnAntipsychotics:{
        type: String
    },
    patiensOnAntiAnxiety:{
        type: String
    },
    patientsOnAntiDepressants:{
        type: String
    },
    patientsOnSedativesHypnotics:{
        type: String
    }
},
{timestamps :true})

const postRoundDataSchema = new mongooose.Schema({
    facilityId:{
        type: String
    },
    providerId:{
        type: String
    },
    dateOfService:{
        type: Date
    },
    uploadFilePath:{
        type: String
    },
    documentstatus:{
        type: String
    },
    documentRemark:{
        type: String
    }
},
{timestamps :true})

const PostRoundData = mongooose.model('PostRoundData',postRoundDataSchema);
const PsychotropicData = mongooose.model('PsychotropicData',psychotropicDataSchema);

const facilitySchema = new mongooose.Schema({
    parentId:{
        type: String
    },
    facilityName: {
        type: String,
        minlength: 1,
        maxlength: 120
    },
    facilityShortName: {
        type: String,
        minlength: 1,
        maxlength: 30
    },
    userRole:{
        type: String
    },
    facilityLoginId: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 40
    },
    partOfCorporate: {
        type: String
    },
    nameOfCorporate:{
        type: String
    },
    facilityEmail: {
        type: String,
        maxlength: 255,
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024
    },
    activeStatus : {
        type : Boolean,
        default: true
    },
    address: {
        line1: {
            type: String,
            minlength: 2,
            maxlength: 40
        },
        line2: {
            type: String,
            minlength: 2,
            maxlength: 40
        },
        city: {
            type: String,
            minlength: 2,
            maxlength: 40
        },
        state: {
            type: String,
            minlength: 2,
            maxlength: 40
        },
        zipCode: {
            type: String,
            minlength: 2,
            maxlength: 40
        }
    },
    psychotropicData : [psychotropicDataSchema],
    postRoundData:[postRoundDataSchema]
},
{
    timestamps: true
})


// hashing the password
saltSecret:String;
facilitySchema.pre('save', function(next){
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(this.password, salt, (err,hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        })
    })
})

const Facility = mongooose.model('Facility',facilitySchema);