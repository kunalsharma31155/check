const router = require("express").Router();
const auth = require('../middleware/auth');

const {printProviderPerformanceReport,printFacilityDetailGDRReport,getFinalPatientSummaryReport,
    getFacilityDetailedGDRReport,facilityPerformanceReport,getFinalSnapShotReport,
    getFinalPatientsForFacilityPatientNumberReport,getPatientsForFacilityPatientNumberReport,
    adminPriorAuthReport, briefProviderPerformanceReport,psychotropicReport,providerPerformanceReport,
     getFacilityPostRoundingReport, getFinalMissingDocumentReport, getPowerOfAttorneyReport,
     printBriefProviderPerformanceReport,printPatientNotesReport,printFacilityPracticePerformanceReport} = require('../controllers/reports.controller');

router.post('/psychotropic-report', auth, psychotropicReport);
router.post('/provider-performance-report', auth, providerPerformanceReport);
router.post('/brief-provider-performance-report', auth, briefProviderPerformanceReport);
router.post('/admin-prior-auth-report',auth,adminPriorAuthReport);
router.post('/get-patients-for-facility-patient-number-report',auth,getPatientsForFacilityPatientNumberReport);
router.post('/get-final-patients-for-facility-patient-number-report',auth,getFinalPatientsForFacilityPatientNumberReport);
router.post('/get-final-patient-summary-report',auth,getFinalPatientSummaryReport);
router.post('/get-final-snap-shot-report',auth,getFinalSnapShotReport);
router.post('/get-final-facility-post-rounding-report', auth, getFacilityPostRoundingReport);
router.post('/get-final-missing-document-report', auth, getFinalMissingDocumentReport);
router.post('/get-facility-detailed-gdr-report', auth, getFacilityDetailedGDRReport);
router.post('/get-power-of-attorney-report', auth, getPowerOfAttorneyReport);
router.post('/facility-performance-report', auth, facilityPerformanceReport);

// print report
router.post('/print-facility-detailed-gdr-report', auth, printFacilityDetailGDRReport);
router.post('/print-provider-performance-report',auth,printProviderPerformanceReport);
router.post('/print-brief-provider-performance-report',auth,printBriefProviderPerformanceReport);
router.post('/print-patient-notes-report',auth,printPatientNotesReport);
router.post('/print-facility-practice-performance-report',auth,printFacilityPracticePerformanceReport);

module.exports = router;