const express = require('express');
const { addDamageReport, getDamageReports } = require('../controllers/carDamageController');
const router = express.Router();

// Route to add a new damage report
router.post('/add', addDamageReport);

// Route to get damage reports
router.get('/list', getDamageReports);

module.exports = router;
