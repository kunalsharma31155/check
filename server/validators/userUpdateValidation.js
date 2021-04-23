const { check, validationResult } = require('express-validator');

exports.updateUserValidatorResult = (req,res,next) =>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success: false, error: error})
    }
    next();
}

exports.updateUserValidator = [
    check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('email is required!'),
    check('userRole')
    .trim()
    .not()
    .isEmpty()
    .withMessage('userRole is required!')
]