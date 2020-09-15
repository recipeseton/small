const { Router } = require('express');
const companyController = require('../controllers/companyController');
const { requireAuth } = require('../middleware/authmiddleware');

const router = Router();

router.get('/company/:companyName', companyController.companyDetailsGet);

router.get('/company/:companyName/products', companyController.companyProductsGet);

router.get('/company/:companyName/products/:productId', companyController.companyProductsGet);

router.post('/company/:companyName/posts', requireAuth, companyController.companyPostsPost);

module.exports = router;