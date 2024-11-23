const express = require('express');
const router = express.Router();

// Import the saveContactMessage function
const { saveMessage } = require('../controllers/contactController');
 // Ensure the path is correct

// POST route for saving contact messages
router.post('/contact', saveMessage);

module.exports = router;
