const router = require("express").Router();
const auth = require('../middleware/auth');
const {createPatientValidator, createPatientValidationResult} = require('../validators/createPatientValidation');
const {updatePatientValidator, updatePatientValidationResult} = require('../validators/updatePatientValidation');


const {searchPatient,deletePatientVisitDetail,updatePatientVisitDetail,getCptCode,getPatientDetail,updatePatientTestDetails,createPatient, searchPatientByName, getAllPatient, updatePatient, getAllFacility,patientTestDetails, getAllRequiredDocument} = require('../controllers/patient.controller');

router.post('/create-patient', auth, createPatient);
router.post('/search-patient-by-name', auth, searchPatientByName);
router.get('/get-all-patient/:page', auth, getAllPatient);
// updatePatientValidator, updatePatientValidationResult,
router.post('/update-patient', auth,   updatePatient);
router.post('/patient-test-details',auth, patientTestDetails);
router.post('/update-patient-test-details/:patientId/:visitId',auth, updatePatientTestDetails);
router.post('/update-patient-visit-data/:patientId/:visitId',auth, updatePatientVisitDetail);
router.patch('/delete-patient-visit-data/:patientId/:visitId',auth, deletePatientVisitDetail);
router.get('/get-all-required-document',auth, getAllRequiredDocument);
router.get('/get-patient-details/:id',auth, getPatientDetail);
router.get('/get-cpt-code',auth, getCptCode);
router.get('/search-patient/:search/:page', auth, searchPatient);



module.exports = router;