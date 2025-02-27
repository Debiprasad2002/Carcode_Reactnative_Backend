
// const express = require('express');
// const router = express.Router();
// const stripePaymentController = require('../controllers/stripePaymentController');

// // API Routes for In-App Payments
// router.post('/create-payment-intent', stripePaymentController.createPaymentIntent);
// router.post('/save-payment', stripePaymentController.savePayment);
// router.get('/payment-history', stripePaymentController.getPaymentHistory);

// module.exports = router;



const express = require('express');
const router = express.Router();
const stripePaymentController = require('../controllers/stripePaymentController');

router.post('/create-payment-intent', stripePaymentController.createPaymentIntent);
router.post('/save-payment', stripePaymentController.savePayment);
router.get('/payment-history', stripePaymentController.getPaymentHistory);

module.exports = router;
