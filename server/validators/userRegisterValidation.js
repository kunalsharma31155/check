const { check, validationResult } = require('express-validator');

exports.userValidationResult = (req,res,next) =>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success: false, error: error})
    }
    next();
}

exports.userValidator = [
    check('firstName')
    .trim()
    .not()
    .isEmpty()
    .withMessage('First name is required!')
    .isLength({ min:3 , max:40 })
    .withMessage('First name must be 3 to 20 characters long!'),
    check('lastName')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Last name is required!')
    .isLength({ min:3 , max:40 })
    .withMessage('Last name must be 3 to 20 characters long!'),
    check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required!')
    .isLength({ min:7 })
    .withMessage('Password must be 7 Character Long!')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)
    .withMessage('Please enter 1 Special Character, 1 Capital 1, Numeric 1 Small'),
    check('userRole')
    .trim()
    .not()
    .isEmpty()
    .withMessage('User Role is required!'),
    check('userLoginId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('User Login Id is required!')
]