const express = require('express');
const router = express.Router();
const stripePaymentController = require('../controllers/stripePaymentController');

// API Endpoints
router.post('/create-payment-session', stripePaymentController.createPaymentSession);
router.get('/payment-success', stripePaymentController.handlePaymentSuccess);
router.get('/payment-history', stripePaymentController.getPaymentHistory);

module.exports = router;
