const pool = require("../config/db");

// Controller to edit a chat message
exports.editChatMessage = async (req, res) => {
  const { id, message } = req.body;

  if (!id || !message) {
    return res.status(400).json({ error: "ID and message are required" });
  }

  try {
    // Update the message in the database
    const query = `UPDATE chat_screen_message SET message = ?, timestamp = NOW() WHERE id = ?`;
    const [result] = await pool.execute(query, [message, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Message not found or not updated" });
    }

    res.status(200).json({ message: "Chat message updated successfully" });
  } catch (error) {
    console.error("Error updating chat message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
