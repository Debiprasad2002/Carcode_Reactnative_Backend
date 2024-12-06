const db = require("../config/db");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Generate Reset Token and Send Email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Fetch user from the database
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Save the token and expiry time to the database
    await db.query(
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
      [resetToken, tokenExpiry, email]
    );

    // Configure the nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,   // Read SMTP email from .env
        pass: process.env.SMTP_PASSWORD, // Read SMTP password from .env
      },
    });

    // Generate the password reset link
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    
    // Send the reset email
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Use the link below to reset your password:\n\n${resetLink}\n\nIf you didn't request this, ignore this email.`,
    });

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Verify the reset token
    const [user] = await db.query("SELECT * FROM users WHERE reset_token = ?", [resetToken]);

    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // Check if the reset token is expired
    const tokenExpiry = new Date(user[0].reset_token_expires);

    if (tokenExpiry < new Date()) {
      return res.status(400).json({ message: "Reset token has expired." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and clear the reset token and expiry time
    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?",
      [hashedPassword, resetToken]
    );

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
