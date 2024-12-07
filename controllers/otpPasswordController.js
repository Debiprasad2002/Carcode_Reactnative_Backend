const db = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Function to generate random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// POST: Request OTP
exports.requestOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (!user.length) {
            return res.status(404).json({ message: 'Email not registered.' });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

        await db.query(
            'UPDATE users SET otp = ?, otpExpires = ? WHERE email = ?',
            [otp, otpExpires, email]
        );

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Your OTP for Password Reset',
            text: `Your OTP is ${otp}. It is valid for 15 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


const bcrypt = require('bcryptjs'); // Import bcrypt

// POST: Verify OTP and Reset Password
exports.verifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
    }

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (!user.length) {
            return res.status(404).json({ message: 'Email not registered.' });
        }

        const storedOtp = user[0].otp;
        const otpExpires = user[0].otpExpires;

        // Validate OTP and expiration
        if (!storedOtp || new Date() > new Date(otpExpires)) {
            return res.status(400).json({ message: 'OTP is invalid or has expired.' });
        }

        if (storedOtp !== otp) {
            return res.status(400).json({ message: 'OTP is incorrect.' });
        }

        // Hash the new password using bcrypt
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear OTP fields
        await db.query(
            'UPDATE users SET password = ?, otp = NULL, otpExpires = NULL WHERE email = ?',
            [hashedPassword, email]
        );

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
        console.error('Error during password reset:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
