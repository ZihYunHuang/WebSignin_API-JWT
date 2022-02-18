const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('🖕👩🖕');
    res.end();
});

module.exports = router;