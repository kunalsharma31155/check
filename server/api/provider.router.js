const router = require("express").Router();
const auth = require('../middleware/auth');
const {createProviderValidator, createProviderValidationResult} = require('../validators/createProviderValidation');
const {updateProviderValidator, updateProviderValidationResult} = require('../validators/updateProviderValidation');


const {createProvider, searchProviderByName, getAllProvider, updateProvider} = require('../controllers/provider.controller');
// createProviderValidator , createProviderValidationResult,
router.post('/create-provider', auth, createProviderValidator, createProviderValidationResult, createProvider);
router.post('/search-provider-by-name', auth, searchProviderByName);
router.get('/get-all-providers', auth, getAllProvider);
router.post('/update-provider', auth, updateProviderValidator, updateProviderValidationResult,  updateProvider);

module.exports = router;