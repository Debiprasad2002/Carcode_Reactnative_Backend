// routes/carInfoRoutes.js

const express = require('express');
const router = express.Router();
const { getAllCarInfo } = require('../controllers/carInfoController');

// Define the route to get all car information
router.get('/view_data', getAllCarInfo);

module.exports = router;
