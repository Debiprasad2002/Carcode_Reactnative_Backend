const db = require('../config/db'); // Assuming db.js is already configured

// POST: Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { name, message, userid } = req.body;
        const profile_picture = req.file ? `/uploads/chatimage/${req.file.filename}` : null;

        // Validation
        if (!name || !message || !userid) {
            return res.status(400).json({ message: 'Name, message, and userid are required.' });
        }

        // Save message to database
        const query = `
            INSERT INTO chat_screen_message (name, message, userid, profile_picture)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [name, message, userid, profile_picture]);

        res.status(201).json({
            message: 'Message sent successfully.',
            id: result.insertId,
            profile_picture,
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// GET: Fetch the most recent 30 messages
exports.fetchMessages = async (req, res) => {
    try {
        const query = `
            SELECT * FROM chat_screen_message
            ORDER BY id DESC
            LIMIT 30
        `;
        const [messages] = await db.query(query);

        // Return messages in ascending order
        res.status(200).json(messages.reverse());
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
