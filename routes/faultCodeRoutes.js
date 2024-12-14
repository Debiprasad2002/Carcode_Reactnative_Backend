const express = require('express');
const router = express.Router();
const faultCodeController = require('../controllers/faultCodeController');

// API Endpoints
// 1. Add a new fault code
router.post('/fault-codes', faultCodeController.addFaultCode);

// 2. Fetch all fault codes
router.get('/fault-codes', faultCodeController.getAllFaultCodes);

// 3. Update a fault code
router.put('/fault-codes', faultCodeController.updateFaultCode);

// 4. Delete a fault code
router.delete('/fault-codes', faultCodeController.deleteFaultCode);

module.exports = router;
