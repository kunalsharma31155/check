const router = require("express").Router();
const auth = require('../middleware/auth');

const { getAllUserAccess,updateUserAccess,getSpecificUserAccess } = require('../controllers/user-access.controller');

router.get('/get-all-user-access',auth,getAllUserAccess);
router.post('/update-user-access',auth,updateUserAccess);
router.get('/get-specific-user-access/:role',auth,getSpecificUserAccess);

module.exports = router;