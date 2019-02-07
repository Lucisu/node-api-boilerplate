const express 			= require('express');
const router 			= express.Router();
const users = require('../../../controllers/User/user.controller.js');

const limiter = require('../limiter');

const authMiddleware = require('../../../middlewares/auth');
const uploadMiddleware = require('../../../middlewares/upload');

router.use(require("./meta.js"));


router.get('/user/test', authMiddleware, users.test);

router.post('/user',limiter.account, users.validate("create"), users.create);
router.put('/user',limiter.api,authMiddleware, users.update);

router.post('/user/login',limiter.login, users.login);
router.post('/user/forgot-password',limiter.login, users.validate("forgotPassword"), users.forgotPassword);
// router.get('/user',limiter.api,authMiddleware, users.findById);

router.post('/user/upload', limiter.api, authMiddleware, uploadMiddleware, users.uploadMulter.single('file'), users.upload);

module.exports = router;
