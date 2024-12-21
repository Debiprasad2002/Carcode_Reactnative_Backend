const db = require('../config/db');

// Fetch all contact messages
const fetchAllContactMessages = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, message, created_at FROM contact_messages');
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages.',
    });
  }
};

module.exports = {
  fetchAllContactMessages,
};
