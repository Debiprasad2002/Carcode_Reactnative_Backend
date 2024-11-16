const express = require('express');
const { getVehicleInfo } = require('../controllers/vehicleController');

const router = express.Router();

// Route to fetch vehicle information
router.get('/vehicle-info', getVehicleInfo);

module.exports = router;
