const db = require('../config/db'); // Import the database connection

// Fetch all chat messages
const fetchAllChats = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM chat_screen_message');
    res.json({
      success: true,
      message: 'Chats fetched successfully.',
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats.',
    });
  }
};

// Delete chat by ID
const deleteChatById = async (req, res) => {
  const { id } = req.body; // Extract 'id' from the request body

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'ID is required to delete a chat.',
    });
  }

  try {
    const [result] = await db.query('DELETE FROM chat_screen_message WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: 'Chat deleted successfully.',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Chat not found or already deleted.',
      });
    }
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat.',
    });
  }
};


// Export the functions
module.exports = {
  fetchAllChats,
  deleteChatById,
};
