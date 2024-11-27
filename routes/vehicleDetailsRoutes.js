// const express = require('express');
// const { getVehicleDetails } = require('../controllers/vehicleDetailsController');

// const router = express.Router();

// // Route to fetch vehicle information
// router.get('/', getVehicleDetails);

// module.exports = router;



const express = require("express");
const { getVehicleDetails } = require("../controllers/vehicleDetailsController");

const router = express.Router();

// Define the route
router.get("/", getVehicleDetails);

module.exports = router;
