const express = require('express');
const router = express.Router();
const { updateValue, getPrefixSum } = require('../controllers/fenwickController');

router.post('/update', updateValue);

router.get('/prefix-sum/:index', getPrefixSum);

module.exports = router;
