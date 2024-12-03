const express = require('express');
const { deleteCarInfo } = require('../controllers/carRegisterDeleteController');
const router = express.Router();

// Route to delete car info based on provided data
router.delete('/delete', deleteCarInfo);

module.exports = router;
