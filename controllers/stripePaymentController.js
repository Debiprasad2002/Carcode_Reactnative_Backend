// const Stripe = require('stripe');
// const db = require('../config/db');
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Store your Stripe secret key in .env

// // Create a PaymentIntent (for in-app payment)
// exports.createPaymentIntent = async (req, res) => {
//     const { name, email, amount, currency } = req.body;

//     if (!name || !email || !amount || !currency) {
//         return res.status(400).json({ message: "Name, email, amount, and currency are required." });
//     }

//     try {
//         // Fetch userId from the database using name and email
//         const [rows] = await db.query('SELECT id FROM users WHERE name = ? AND email = ?', [name, email]);
//         if (rows.length === 0) {
//             return res.status(404).json({ message: "User not found." });
//         }
//         const userId = rows[0].id;

//         // Create a PaymentIntent for in-app payments
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: Math.round(amount * 100), // Convert to smallest currency unit (cents)
//             currency: currency,
//             payment_method_types: ['card'], // Supports card payments
//             metadata: { userId: userId }, // Attach user ID for tracking
//         });

//         // Return clientSecret to app (used for confirming payment in-app)
//         res.status(200).json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         console.error("Error creating payment intent:", error.message);
//         res.status(500).json({ message: "Failed to create payment intent." });
//     }
// };

// // Save payment details after successful payment in-app
// exports.savePayment = async (req, res) => {
//     const { paymentIntentId } = req.body;

//     if (!paymentIntentId) {
//         return res.status(400).json({ message: "Payment Intent ID is required." });
//     }

//     try {
//         // Retrieve payment details from Stripe
//         const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//         if (!paymentIntent || paymentIntent.status !== 'succeeded') {
//             return res.status(400).json({ message: "Payment is not completed yet." });
//         }

//         // Get user_id from metadata
//         const userId = paymentIntent.metadata.userId;

//         // Store payment in database
//         const query = `
//             INSERT INTO payments (user_id, amount, currency, payment_status, transaction_id)
//             VALUES (?, ?, ?, ?, ?)
//         `;
//         const values = [
//             userId,
//             paymentIntent.amount / 100, // Convert cents to normal currency
//             paymentIntent.currency,
//             paymentIntent.status,
//             paymentIntent.id, // Stripe's unique payment intent ID
//         ];

//         await db.query(query, values);

//         res.status(200).json({ message: "Payment saved successfully in the database." });
//     } catch (error) {
//         console.error("Error saving payment:", error.message);
//         res.status(500).json({ message: "Failed to save payment." });
//     }
// };

// //Fetching Payment History for a User
// exports.getPaymentHistory = async (req, res) => {
//     const { name, email } = req.query;

//     if (!name || !email) {
//         return res.status(400).json({ message: "Name and email are required." });
//     }

//     try {
//         // Fetch user_id from the database
//         const [rows] = await db.query('SELECT id FROM users WHERE name = ? AND email = ?', [name, email]);

//         if (rows.length === 0) {
//             return res.status(404).json({ message: "User not found." });
//         }
//         const userId = rows[0].id;

//         // Fetch all payments for this user
//         const [payments] = await db.query('SELECT * FROM payments WHERE user_id = ?', [userId]);

//         res.status(200).json({ success: true, data: payments });
//     } catch (error) {
//         console.error("Error fetching payment history:", error.message);
//         res.status(500).json({ message: "Failed to fetch payment history." });
//     }
// };


const Stripe = require('stripe');
const db = require('../config/db');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const nodemailer = require('nodemailer');

// Create a PaymentIntent
exports.createPaymentIntent = async (req, res) => {
    const { name, email, amount, currency, registrationNumber } = req.body;

    if (!name || !email || !amount || !currency || !registrationNumber) {
        return res.status(400).json({ message: "Name, email, amount, currency, and registration number are required." });
    }

    try {
        // Fetch user ID from the database
        const [rows] = await db.query('SELECT id FROM users WHERE name = ? AND email = ?', [name, email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        const userId = rows[0].id;

        // Create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to smallest currency unit (cents)
            currency: currency,
            payment_method_types: ['card'],
            metadata: { userId: userId, registrationNumber: registrationNumber },
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error.message);
        res.status(500).json({ message: "Failed to create payment intent." });
    }
};

// Save payment and fetch HPI check details
exports.savePayment = async (req, res) => {
    const { paymentIntentId, registrationNumber } = req.body;

    if (!paymentIntentId || !registrationNumber) {
        return res.status(400).json({ message: "Payment Intent ID and registration number are required." });
    }

    try {
        // Retrieve payment details from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (!paymentIntent || paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ message: "Payment is not completed yet." });
        }

        const userId = paymentIntent.metadata.userId;
        const userEmail = await getUserEmailById(userId);

        // Fetch HPI Check Details
        const hpiResponse = await axios.get(`http://localhost:3000/api/hpi/full-check?registrationNumber=${registrationNumber}`);
        const hpiData = hpiResponse.data;

        // Send email with HPI details
        await sendEmail(userEmail, registrationNumber, hpiData);

        // Store payment in database
        const query = `
            INSERT INTO payments (user_id, amount, currency, payment_status, transaction_id, registration_number)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            userId,
            paymentIntent.amount / 100,
            paymentIntent.currency,
            paymentIntent.status,
            paymentIntent.id,
            registrationNumber
        ];

        await db.query(query, values);

        res.status(200).json({ message: "Payment saved and HPI report sent successfully." });
    } catch (error) {
        console.error("Error processing payment and sending email:", error.message);
        res.status(500).json({ message: "Failed to process payment and send HPI report." });
    }
};


exports.getPaymentHistory = async (req, res) => {
    const { name, email } = req.query;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required." });
    }

    try {
        // Fetch user ID from the database
        const [rows] = await db.query('SELECT id FROM users WHERE name = ? AND email = ?', [name, email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        const userId = rows[0].id;

        // Fetch all payments for this user
        const [payments] = await db.query('SELECT * FROM payments WHERE user_id = ?', [userId]);

        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        console.error("Error fetching payment history:", error.message);
        res.status(500).json({ message: "Failed to fetch payment history." });
    }
};


// Function to get user email by user ID
const getUserEmailById = async (userId) => {
    const [rows] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
        throw new Error("User not found.");
    }
    return rows[0].email;
};

// Function to send email
const sendEmail = async (email, registrationNumber, hpiData) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const emailContent = `
        HPI Check Report for Registration Number: ${registrationNumber}

        Vehicle Details:
        - Make: ${hpiData.data.VehicleRegistration.Make}
        - Model: ${hpiData.data.VehicleRegistration.Model}
        - Year of Manufacture: ${hpiData.data.VehicleRegistration.YearOfManufacture}
        - Colour: ${hpiData.data.VehicleRegistration.Colour}
        - Fuel Type: ${hpiData.data.VehicleRegistration.FuelType}
        - VIN: ${hpiData.data.VehicleRegistration.Vin}

        History:
        - Stolen Record: ${hpiData.data.VehicleHistory.stolenRecord ? "Yes" : "No"}
        - Finance Record: ${hpiData.data.VehicleHistory.financeRecord ? "Yes" : "No"}
        - Write-off Record: ${hpiData.data.VehicleHistory.writeOffRecord ? "Yes" : "No"}
        - Number of Previous Keepers: ${hpiData.data.VehicleHistory.NumberOfPreviousKeepers}

        Performance:
        - Max Speed: ${hpiData.data.Performance.MaxSpeed.Mph} mph
        - Power: ${hpiData.data.Performance.Power.Bhp} BHP
        - Torque: ${hpiData.data.Performance.Torque.Nm} Nm

        Please keep this report for your records.
    `;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `HPI Check Report - ${registrationNumber}`,
        text: emailContent
    });
};
