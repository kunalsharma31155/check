const router = require("express").Router();
const auth = require('../middleware/auth');
const {loginuserValidator, loginuserValidationResult} = require('../validators/userLoginValidation');
const {userValidator, userValidationResult} = require('../validators/userRegisterValidation');
const {updateUserValidator, updateUserValidatorResult} = require('../validators/userUpdateValidation');


const { loginUser, createUser, searchUsersByName,  userUpdate, getAllUsers,getCurrentUser,checkAdminPassword,getCorporates} = require('../controllers/user.controller');

// normal signup
router.post('/login', loginuserValidator , loginuserValidationResult, loginUser);
router.post('/create-user',auth, userValidator , userValidationResult, createUser);
router.post('/usersearchbyname', auth, searchUsersByName);
router.post('/update-user', auth, updateUserValidator, userUpdate);
router.get('/get-all-users',auth,getAllUsers);
router.get('/get-current-user/:id',auth,getCurrentUser);
router.post('/check-admin-password', auth, checkAdminPassword);
router.get('/get-corporates',auth,getCorporates);

module.exports = router;