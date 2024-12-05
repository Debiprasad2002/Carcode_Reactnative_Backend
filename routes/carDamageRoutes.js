const express = require('express');
const router = express.Router();
const { addDamageReport } = require('../controllers/carDamageController');

// POST endpoint for adding a damage report
router.post('/add', addDamageReport);

module.exports = router;
