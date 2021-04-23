const router = require("express").Router();
const auth = require('../middleware/auth');
const {createFacilityValidator, createFacilityValidationResult} = require('../validators/createFacilityValidation');
const {updateFacilityValidator, updateFacilityValidationResult} = require('../validators/updateFacilityValidation');


const {getCorporateFacility,psychotropicData,createFacility, searchFacilityByName, getAllFacility, updateFacility, postRoundData} = require('../controllers/facility.controller');

router.post('/create-facility', auth, createFacilityValidator , createFacilityValidationResult, createFacility);
router.post('/search-facility-by-name', auth, searchFacilityByName);
router.get('/get-all-facility', auth, getAllFacility);
router.post('/update-facility', auth, updateFacilityValidator, updateFacilityValidationResult,  updateFacility);
router.post('/psychotropic-data',auth,psychotropicData);
router.post('/post-round-data', auth, postRoundData);
router.get('/get-corporate-facility/:name',auth,getCorporateFacility);




module.exports = router;