const express 			= require('express');
const router 			= express.Router();
const authMiddleware = require('../../middlewares/auth');
const uploadMiddleware = require('../../middlewares/upload');
const validation = require("../../middlewares/validation");
const config = require("../../config/config.json");
const users = require('../../controllers/User/user.controller.js');

const multer  = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const rateLimit = require("express-rate-limit");


router.use(require("./users"));



module.exports = router;
