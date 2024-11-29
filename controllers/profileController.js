// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Multer configuration for handling file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = path.join(__dirname, "../uploads");
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir); // Create "uploads" folder if it doesn't exist
//         }
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueSuffix);
//     },
// });
// const upload = multer({ storage }).single("profile_picture");





// // Upload profile picture and save data
// const uploadProfile = (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(500).json({ message: "File upload failed", error: err.message });
//     }

//     // Access name and email from the decoded JWT
//     const { name, email } = req.user; // This will be set by the authenticateToken middleware

//     if (!name || !email) {
//       return res.status(400).json({ message: "Name and email are required" });
//     }

//     const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

//     if (!profilePicture) {
//       return res.status(400).json({ message: "Profile picture is required" });
//     }

//     // Simulate saving to the database
//     const userProfile = {
//       name,
//       email,
//       profilePicture,
//     };

//     console.log("Saved Profile:", userProfile); // Log saved profile data
//     res.status(201).json({ message: "Profile uploaded successfully", data: userProfile });
//   });
// };


// module.exports = { uploadProfile };



// <-----------------------------------------------------------Approach 2 ------------------------------------------------------->
// const db = require('../config/db'); // Database configuration
// const jwt = require('jsonwebtoken');

// const getProfileDetails = async (req, res) => {
//   try {
//     // Get token from request header
//     const token = req.headers.authorization?.split(' ')[1]; // Format: Bearer <token>

//     if (!token) {
//       return res.status(401).json({ message: 'Token not provided' });
//     }

//     // Verify and decode the token
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Make sure JWT_SECRET is set in .env
//     const userEmail = decodedToken.email; // Extract email from token payload

//     // Fetch user details from the database using email
//     const query = 'SELECT name, email FROM users WHERE email = ?';
//     const [rows] = await db.execute(query, [userEmail]);

//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Send the user details as a response
//     res.status(200).json({
//       message: 'Profile details fetched successfully',
//       user: rows[0], // { name, email }
//     });
//   } catch (error) {
//     console.error('Error fetching user details:', error.message);
//     res.status(500).json({ message: 'Error fetching user details', error: error.message });
//   }
// };

// module.exports = { getProfileDetails };



// <------------------------------------------------Approach 3 --------------------------------->
const db = require('../config/db'); // Database configuration
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// ** GET Method: Fetch Profile Details **
const getProfileDetails = async (req, res) => {
  try {
    // Get token from request header
    const token = req.headers.authorization?.split(' ')[1]; // Format: Bearer <token>

    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Make sure JWT_SECRET is set in .env
    const userEmail = decodedToken.email; // Extract email from token payload

    // Fetch user details from the database using email
    const query = 'SELECT name, email, profile_picture FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [userEmail]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user details as a response
    res.status(200).json({
      message: 'Profile details fetched successfully',
      user: rows[0], // { name, email, profile_picture }
    });
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
};

// ** Multer Configuration for File Upload **
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../uploads/profile_pictures');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    if (!allowedExtensions.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Invalid file type. Only .png, .jpg, and .jpeg are allowed.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit: 2MB
}).single('profilePicture');

// ** POST Method: Update Profile Picture **
const uploadProfilePicture = async (req, res) => {
  try {
    // Get token from request header
    const token = req.headers.authorization?.split(' ')[1]; // Format: Bearer <token>

    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Make sure JWT_SECRET is set in .env
    const userEmail = decodedToken.email; // Extract email from token payload

    // Use Multer to handle file upload
    upload(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      // Get the file path for the uploaded image
      const profilePicturePath = `/uploads/profile_pictures/${req.file.filename}`;

      // Update the user's profile picture in the database
      const query = 'UPDATE users SET profile_picture = ? WHERE email = ?';
      await db.execute(query, [profilePicturePath, userEmail]);

      res.status(200).json({
        message: 'Profile picture updated successfully',
        profilePicture: profilePicturePath,
      });
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error.message);
    res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
  }
};

module.exports = { getProfileDetails, uploadProfilePicture };
