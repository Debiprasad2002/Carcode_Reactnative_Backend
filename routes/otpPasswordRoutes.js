const express = require('express');
const router = express.Router();
const otpPasswordController = require('../controllers/otpPasswordController');

// Request OTP
router.post('/request-otp', otpPasswordController.requestOtp);

// Verify OTP and Reset Password
router.post('/verify-otp', otpPasswordController.verifyOtpAndResetPassword);

module.exports = router;
