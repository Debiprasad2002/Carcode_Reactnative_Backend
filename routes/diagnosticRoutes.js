// routes/diagnosticRoutes.js

const express = require('express');
const { getSolutionByCode } = require('../controllers/diagnosticController');
const router = express.Router();

router.post('/getSolution', getSolutionByCode);

module.exports = router;
