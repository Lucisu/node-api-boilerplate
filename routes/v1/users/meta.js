const express 			= require('express');
const router 			= express.Router();
const authMiddleware = require('../../../middlewares/auth');
const uploadMiddleware = require('../../../middlewares/upload');
const metas = require('../../../controllers/User/meta.controller.js');

router.get('/user/meta', authMiddleware, metas.find);

router.put('/user/meta', authMiddleware, metas.add);
router.delete('/user/meta', authMiddleware, metas.delete);



module.exports = router;
