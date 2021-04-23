const { check, validationResult } = require('express-validator');

exports.updateFacilityValidationResult = (req,res,next) =>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success: false, error: error})
    }
    next();
}

exports.updateFacilityValidator = [
    check('facilityShortName')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Facility short Name is required!'),
    check('address.zipCode')
    .trim()
    .not()
    .isEmpty()
    .withMessage('ZipCode is required!'),
    check('address.city')
    .trim()
    .not()
    .isEmpty()
    .withMessage('City is required!'),
    check('address.state')
    .trim()
    .not()
    .isEmpty()
    .withMessage('State is required!')
]