const express = require('express');
const router = express.Router();
const carRegisterController = require('../controllers/carRegisterController');

// Route for registering car information
router.post('/', carRegisterController.registerCarInfo);

module.exports = router;
