const express = require("express");
const router = express.Router();
const adminModeratorChatController = require("../controllers/adminModeratorChatController");

// Route to edit a chat message
router.put("/edit-chat-message", adminModeratorChatController.editChatMessage);

module.exports = router;
