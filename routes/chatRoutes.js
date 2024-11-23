const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/chatController');

// Route for sending a chat message
router.post('/send-message', sendMessage);

module.exports = router;
