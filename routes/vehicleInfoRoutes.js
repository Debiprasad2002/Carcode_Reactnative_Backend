const express = require('express');
const router = express.Router();
const vehicleInfoController = require('../controllers/vehicleInfoController');

// Route to get vehicle information
router.get('/vehicle-info', vehicleInfoController.getVehicleInfo);

module.exports = router;
