// const express = require("express");
// const { uploadProfile } = require("../controllers/profileController");
// const authenticateToken = require("../middlewares/authMiddleware");
// const router = express.Router();

// // POST route for uploading profile picture
// router.post("/uploadProfile", authenticateToken, uploadProfile);

// module.exports = router;

// <-------------------------------------------------Approach 2 ------------------------------------------------------------------------->
// const express = require('express');
// const router = express.Router();
// const { getProfileDetails, uploadProfilePicture } = require('../controllers/profileController');
// const { authenticateToken } = require('../middlewares/authMiddleware'); // Ensure token verification middleware is present
// const authMiddleware = require('../middlewares/authMiddleware');
// const multer = require('multer'); // For handling file uploads

// const upload = multer({ dest: 'uploads/' });

// // Route for fetching profile details
// router.get('/profile', authenticateToken, getProfileDetails);


// // POST: Upload or update profile picture
// router.post('/upload-picture', authMiddleware, upload.single('profile_picture'), uploadProfilePicture);


// module.exports = router;



// <---------------------------Approach 3 --------------------------->
const express = require('express');
const { getProfileDetails, uploadProfilePicture } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to fetch profile details
router.get('/profile', authMiddleware, getProfileDetails);

// Route to upload profile picture
router.post('/upload-picture', authMiddleware, uploadProfilePicture);

module.exports = router;
