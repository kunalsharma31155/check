const { check, validationResult } = require('express-validator');

exports.updatePatientValidationResult = (req,res,next) =>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success: false, error: error})
    }
    // next();
}

exports.updatePatientValidator = [
    check('patientFacility')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Facility Name is required!'),
    check('patientProvider')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Provider Name is required!'),
    // check('powerOfAttorneyUserId')
    // .trim()
    // .not()
    // .isEmpty()
    // .withMessage('Power of attorney UserId is required!')
]