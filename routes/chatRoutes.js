const express = require('express');
const multer = require('multer');
const router = express.Router();
const { sendMessage, fetchMessages } = require('../controllers/chatController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/chatimage'); // Save images in the uploads/chatimage folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// POST: Add a new message with optional image upload
router.post('/sendMessage', upload.single('profile_picture'), sendMessage);

// GET: Fetch the recent 30 messages
router.get('/fetchMessages', fetchMessages);

module.exports = router;
