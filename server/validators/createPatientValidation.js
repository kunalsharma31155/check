const { check, validationResult } = require('express-validator');

exports.createPatientValidationResult = (req,res,next) =>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success: false, error: error})
    }
    // next();
}

exports.createPatientValidator = [
    check('firstName')
    .trim()
    .not()
    .isEmpty()
    .withMessage('FirstName Name is required!'),
    check('lastName')
    .trim()
    .not()
    .isEmpty()
    .withMessage('LastName is required!'),
    check('patientDOB')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Patient DOB is required!'),
    check('patientFacility')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Patient Facility is required!'),
    check('patientProvider')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Patient Provider is required!')
]