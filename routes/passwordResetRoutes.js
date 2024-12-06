const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword } = require("../controllers/passwordResetController");

// Forgot password route
router.post("/forgot-password", forgotPassword);

// Reset password route
router.post("/reset-password", resetPassword);

module.exports = router;
