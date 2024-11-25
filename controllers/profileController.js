const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Create "uploads" folder if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    },
});
const upload = multer({ storage }).single("profile_picture");





// Upload profile picture and save data
const uploadProfile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }

    // Access name and email from the decoded JWT
    const { name, email } = req.user; // This will be set by the authenticateToken middleware

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Simulate saving to the database
    const userProfile = {
      name,
      email,
      profilePicture,
    };

    console.log("Saved Profile:", userProfile); // Log saved profile data
    res.status(201).json({ message: "Profile uploaded successfully", data: userProfile });
  });
};


module.exports = { uploadProfile };
