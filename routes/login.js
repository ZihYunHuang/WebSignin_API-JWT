const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// 登入
router.post('/', loginController.login);

module.exports = router;
