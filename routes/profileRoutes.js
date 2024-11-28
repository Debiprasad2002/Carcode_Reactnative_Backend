// const express = require("express");
// const { uploadProfile } = require("../controllers/profileController");
// const authenticateToken = require("../middlewares/authMiddleware");
// const router = express.Router();

// // POST route for uploading profile picture
// router.post("/uploadProfile", authenticateToken, uploadProfile);

// module.exports = router;

// <-------------------------------------------------Approach 2 ------------------------------------------------------------------------->
const express = require('express');
const router = express.Router();
const { getProfileDetails } = require('../controllers/profileController');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Ensure token verification middleware is present

// Route for fetching profile details
router.get('/profile', authenticateToken, getProfileDetails);

module.exports = router;

