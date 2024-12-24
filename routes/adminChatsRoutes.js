const express = require('express');
const router = express.Router();
const adminChatsController = require('../controllers/adminChatsController');
const adminModeratorChatController = require("../controllers/adminModeratorChatController");

// Route to fetch all chat messages
router.get('/chats', adminChatsController.fetchAllChats);

// Route to delete a chat by ID
router.delete('/chats/delete', adminChatsController.deleteChatById);


// Route to edit a chat message by ID
// Route to edit a chat message (should be PUT, not POST)
router.put("/edit-chat-message", adminModeratorChatController.editChatMessage);

module.exports = router;
