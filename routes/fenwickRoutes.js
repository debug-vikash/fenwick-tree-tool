const express = require('express');
const router = express.Router();
const { updateValue, getPrefixSum, getAllValues, getDbPrefixSum } = require('../controllers/fenwickController');

router.post('/update', updateValue);

router.get('/prefix-sum/:index', getPrefixSum);

router.get('/prefix-db/:index', getDbPrefixSum);

router.get('/all', getAllValues);

module.exports = router;
