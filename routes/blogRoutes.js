const express = require('express');
const multer = require('multer');
const path = require('path');
const blogController = require('../controllers/blogController');

const router = express.Router();

// Multer storage for blog images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/blogimage');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes
router.post('/add', upload.single('image'), blogController.addBlog); // Add a blog
router.get('/get', blogController.getBlogs); // Get blogs
router.put('/update', upload.single('image'), blogController.updateBlog); // Update a blog
router.delete('/delete', blogController.deleteBlog); // Delete a blog

module.exports = router;
