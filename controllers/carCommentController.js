const db = require('../config/db'); // Database connection
const multer = require('multer'); // File upload middleware
const path = require('path');



// POST: Add a new comment

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName); // Save the file with a unique name
    },
  });
  
  // File filter for image types
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept only image files
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };
  
  // Multer middleware
  const upload = multer({ storage, fileFilter }).single('image'); // Handle a single image file
  
  // POST: Add a new comment with optional image
  exports.addComment = (req, res) => {
    // Use multer to handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
  
      const { cid, comment, commentby, userid, fixed_code } = req.body;
      const image = req.file ? req.file.path : null; // Save the uploaded image path
  
      // Validation
      if (!cid || !comment || !commentby) {
        return res.status(400).json({ message: 'Car ID (cid), comment, and commentby are required.' });
      }
  
      try {
        const createdate = new Date(); // Current date-time
  
        // Insert query
        await db.query(
          'INSERT INTO car_comment (cid, comment, commentby, createdate, userid, fixed_code, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [cid, comment, commentby, createdate, userid || null, fixed_code || null, image || null]
        );
  
        res.status(201).json({ message: 'Comment added successfully.', imagePath: image });
      } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    });
  };

// GET: Fetch comments by Car ID (cid)
exports.getCommentsByCid = async (req, res) => {
  const { cid } = req.body; // Extract cid from the request body

  // Validation
  if (!cid) {
    return res.status(400).json({ message: 'Car ID (cid) is required.' });
  }

  try {
    // Query the database for the given CID
    const [results] = await db.query('SELECT * FROM car_comment WHERE cid = ?', [cid]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No comments found for the given Car ID.' });
    }

    res.status(200).json({
      message: 'Comments fetched successfully.',
      data: results,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
