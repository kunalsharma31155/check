const { check, validationResult } = require('express-validator');

exports.createFacilityValidationResult = (req,res,next) =>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success: false, error: error})
    }
    next();
}

exports.createFacilityValidator = [
    check('facilityName')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Facility Name is required!'),
    check('facilityShortName')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Facility ShortName is required!'),
    check('facilityLoginId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Facility LoginId is required!'),
    check('facilityEmail')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Facility Email is required!'),
    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required!')
    .isLength({ min:7 })
    .withMessage('Password must be 7 Character Long!')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)
    .withMessage('Please enter 1 Special Character, 1 Capital 1, Numeric 1 Small'),
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