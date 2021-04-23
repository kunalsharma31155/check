const { check, validationResult } = require('express-validator');

exports.loginuserValidationResult = (req,res,next) =>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success: false, error: error})
    }
    next();
}

exports.loginuserValidator = [
    check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email/UserId is required!'),
    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required!')
]