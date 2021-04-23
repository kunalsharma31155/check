const { check, validationResult } = require('express-validator');

exports.postRoundValidatorResult = (req,res,next) =>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success: false, error: error})
    }
    // next();
}

exports.postRoundValidator = [
    check('facilityId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Facility Id is required!'),
    check('providerId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Provider Id is required!'),
    check('dateOfService')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Date Of Service is required!')
]