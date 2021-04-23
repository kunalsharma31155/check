const { check, validationResult } = require('express-validator');

exports.createProviderValidationResult = (req,res,next) =>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success: false, error: error})
    }
    next();
}

exports.createProviderValidator = [
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
    check('providerTypes')
    .not()
    .isEmpty()
    .withMessage('Provider type is required!')
]