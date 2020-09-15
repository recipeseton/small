const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/signup', authController.signupGet);

router.post('/signup', authController.signupPost);

router.get('/login', authController.loginGet);

router.post('/login', authController.loginPost);

router.get('/company/signup', authController.companySignupGet);

router.post('/company/signup', authController.companySignupPost);

router.get('/company/login', authController.companyLoginGet);

router.post('/company/login', authController.companyLoginPost);

router.get('/logout', authController.logoutGet);

module.exports = router;