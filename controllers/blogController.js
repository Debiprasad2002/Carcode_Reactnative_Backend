const db = require('../config/db');
const path = require('path');

// Add a new blog entry
exports.addBlog = async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/blogimage/${req.file.filename}` : null;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }

    try {
        const [result] = await db.query('INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)', [title, content, image]);
        res.status(201).json({ message: 'Blog added successfully.', blogId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

// Fetch all blogs (limit to recent 30 entries)
exports.getBlogs = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, title, content, image FROM blogs ORDER BY id DESC LIMIT 30');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

// Update a blog entry
exports.updateBlog = async (req, res) => {
    const { id, title, content } = req.body;
    const image = req.file ? `/uploads/blogimage/${req.file.filename}` : null;

    if (!id) {
        return res.status(400).json({ message: 'Blog ID is required.' });
    }

    try {
        const [result] = await db.query(
            'UPDATE blogs SET title = ?, content = ?, image = COALESCE(?, image) WHERE id = ?',
            [title, content, image, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        res.status(200).json({ message: 'Blog updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

// Delete a blog entry
exports.deleteBlog = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Blog ID is required.' });
    }

    try {
        const [result] = await db.query('DELETE FROM blogs WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        res.status(200).json({ message: 'Blog deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.', error });
    }
};
