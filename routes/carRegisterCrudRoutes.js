const express = require('express');
const { updateCarInfo, deleteCarInfo } = require('../controllers/carRegisterCrudController');
const router = express.Router();

// Route to update car info
router.put('/update', updateCarInfo);

// Route to delete car info
router.delete('/delete/:registration', deleteCarInfo);

module.exports = router;
