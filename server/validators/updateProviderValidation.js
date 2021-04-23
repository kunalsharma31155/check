const { check, validationResult } = require('express-validator');

exports.updateProviderValidationResult = (req,res,next) =>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success: false, error: error})
    }
    next();
}

exports.updateProviderValidator = [
    check('providerId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Provider Id is required!'),
    check('providerTypes')
    .not()
    .isEmpty()
    .withMessage('Provider type is required!'),
]