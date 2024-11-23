const db = require('../config/db');

// Controller to handle sending a chat message
const sendMessage = async (req, res) => {
  const { message, userid } = req.body;

  // Input validation
  if (!message || !userid) {
    return res.status(400).json({
      success: false,
      error: 'Message and userid are required.',
    });
  }

  try {
    // Insert the chat message into the database
    const query = 'INSERT INTO chat_messages (message, userid) VALUES (?, ?)';
    const [result] = await db.execute(query, [message, userid]);

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Message sent',
      data: { id: result.insertId, message, userid },
    });
  } catch (err) {
    // Error response
    console.error('Database error:', err);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while saving the chat message.',
    });
  }
};

module.exports = { sendMessage };
