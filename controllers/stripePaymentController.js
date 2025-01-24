const Stripe = require('stripe');
const db = require('../config/db');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Add your secret key in .env

// Initiate Payment
exports.createPaymentSession = async (req, res) => {
    const { name, email, amount, currency } = req.body;

    if (!name || !email || !amount || !currency) {
        return res.status(400).json({ message: "Name, email, amount, and currency are required." });
    }

    try {
        // Fetch userId from the database using name and email
        const [rows] = await db.query('SELECT id FROM users WHERE name = ? AND email = ?', [name, email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found with the provided name and email." });
        }
        const userId = rows[0].id;

        // Create Stripe payment session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: 'Advanced Features Payment' },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: { userId },
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
        });

        res.status(200).json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error("Error creating payment session:", error.message);
        res.status(500).json({ message: "Failed to create payment session." });
    }
};

// Handle Payment Success
exports.handlePaymentSuccess = async (req, res) => {
    const { sessionId } = req.query;

    if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required." });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Save payment details to the database
        const query = `
            INSERT INTO payments (user_id, amount, currency, payment_status, transaction_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            session.metadata.userId,
            session.amount_total / 100, // Stripe stores amounts in cents
            session.currency,
            session.payment_status,
            session.payment_intent,
        ];

        await db.query(query, values);

        res.status(200).json({ message: "Payment successful and recorded in the database." });
    } catch (error) {
        console.error("Error handling payment success:", error.message);
        res.status(500).json({ message: "Failed to handle payment success." });
    }
};

// Fetch Payment History of the methond
exports.getPaymentHistory = async (req, res) => {
    const { name, email } = req.query;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required." });
    }

    try {
        // Fetch userId from the database using name and email
        const [rows] = await db.query('SELECT id FROM users WHERE name = ? AND email = ?', [name, email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found with the provided name and email." });
        }
        const userId = rows[0].id;

        // Fetch payment history for the user
        const [payments] = await db.query('SELECT * FROM payments WHERE user_id = ?', [userId]);

        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        console.error("Error fetching payment history:", error.message);
        res.status(500).json({ message: "Failed to fetch payment history." });
    }
};
