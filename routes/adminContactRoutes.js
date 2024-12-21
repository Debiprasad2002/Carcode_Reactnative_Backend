const express = require('express');
const { fetchAllContactMessages } = require('../controllers/adminContactController');

const router = express.Router();

// Route to fetch all contact messages
router.get('/admin/contact-messages', fetchAllContactMessages);

module.exports = router;
