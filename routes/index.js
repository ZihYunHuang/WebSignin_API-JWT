const express = require('express');
const router = express.Router();
const signController = require('../controllers/signController');

// 打卡
router.post('/sign', signController.sign);

module.exports = router;
