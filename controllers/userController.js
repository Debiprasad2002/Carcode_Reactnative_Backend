const db = require('../config/db');

// Controller to block a user
exports.blockUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Update the user status to 'blocked'
    const [result] = await db.query('UPDATE users SET status = ? WHERE id = ?', ['blocked', userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User blocked successfully.' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to unblock a user
exports.unblockUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Update the user status to 'active'
    const [result] = await db.query('UPDATE users SET status = ? WHERE id = ?', ['active', userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User unblocked successfully.' });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
