const express = require("express");
const { uploadProfile } = require("../controllers/profileController");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

// POST route for uploading profile picture
router.post("/uploadProfile", authenticateToken, uploadProfile);

module.exports = router;
