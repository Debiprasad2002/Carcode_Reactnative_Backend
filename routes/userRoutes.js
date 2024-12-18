const express = require('express');
const { blockUser, unblockUser } = require('../controllers/userController');
const router = express.Router();

// Block User
router.post('/block', blockUser);

// Unblock User
router.post('/unblock', unblockUser);

module.exports = router;
