const express = require('express');
const router = express.Router();
const { uploadProfileImage } = require('../controllers/profileImageController');

// POST: Upload profile image
router.post('/upload-image', uploadProfileImage); // Route for uploading profile image

module.exports = router;
