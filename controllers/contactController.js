// controllers/contactController.js
const db = require('../config/db');  // Import the database connection

// Controller function to handle saving the message
const saveMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    // SQL query to insert the message into the database
    const query = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
    const values = [name, email, message];

    // Insert the data into the database
    await db.query(query, values);

    return res.status(201).json({ success: true, message: "Message saved successfully." });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ success: false, error: "An error occurred while saving the message.", details: err.message });
  }
};

module.exports = { saveMessage };
