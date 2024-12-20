const express = require('express');
const router = express.Router();
const adminChatsController = require('../controllers/adminChatsController');

// Route to fetch all chat messages
router.get('/chats', adminChatsController.fetchAllChats);

// Route to delete a chat by ID
router.delete('/chats/delete', adminChatsController.deleteChatById);

module.exports = router;
