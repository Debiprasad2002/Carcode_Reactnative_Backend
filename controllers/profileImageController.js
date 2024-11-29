const db = require('../config/db'); // Database configuration
const formidable = require('formidable'); // For handling file uploads
const path = require('path');
const fs = require('fs');



const uploadProfileImage = (req, res) => {
    console.log('uploadProfileImage controller invoked'); // Logs controller invocation
  
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../uploads/profile_pictures');
    form.keepExtensions = true;
  
    console.log('Setting up formidable with upload directory:', form.uploadDir); // Logs upload directory
  
    form.parse(req, async (err, fields, files) => {
        console.log('Parsing form data...');
        if (err) {
          console.error('Error parsing form:', err.message);
          return res.status(400).json({ message: 'Error parsing the form', error: err.message });
        }
      
        console.log('Parsed fields:', fields);
        console.log('Parsed files:', files);
      
        const { name, email } = fields;
        const userEmail = Array.isArray(email) ? email[0].trim() : email.trim();
      
        // Validate required fields
        if (!name || !userEmail) {
          console.error('Missing name or email in the request.');
          return res.status(400).json({ message: 'Name and email are required.' });
        }
      
        // Check if the image file is present
        const imageFile = files.image && files.image[0];  // Access the first file in the array
        if (!imageFile || !imageFile.filepath) {
          console.error('File not found or invalid file upload.');
          return res.status(400).json({ message: 'Image file is required.' });
        }
      
        const oldPath = imageFile.filepath;
        const newFilename = `${Date.now()}_${imageFile.originalFilename}`;
        const newPath = path.join(form.uploadDir, newFilename);
      
        console.log('Validating email in database:', userEmail);
        try {
          const query = 'SELECT * FROM users WHERE email = ?';
          console.log('Executing query:', query, 'with params:', [userEmail]);
          const [rows] = await db.execute(query, [userEmail]);
          console.log('Database query result:', rows);
      
          if (rows.length === 0) {
            console.error('User not found for email:', userEmail);
            return res.status(404).json({ message: 'User not found with the provided email.' });
          }
      
          console.log('Renaming file...');
          fs.rename(oldPath, newPath, async (error) => {
            if (error) {
              console.error('Error renaming file:', error.message);
              return res.status(500).json({ message: 'File handling error', error: error.message });
            }
            console.log('File renamed successfully:', newPath);
      
            const profilePicturePath = `/uploads/profile_pictures/${newFilename}`;
            const updateQuery = 'UPDATE users SET profile_picture = ? WHERE email = ?';
      
            try {
              await db.execute(updateQuery, [profilePicturePath, userEmail]);
              console.log('Profile picture updated in database.');
              return res.status(200).json({
                message: 'Profile image uploaded successfully.',
                profile_picture: profilePicturePath,
              });
            } catch (dbError) {
              console.error('Error updating database:', dbError.message);
              return res.status(500).json({ message: 'Database update error', error: dbError.message });
            }
          });
        } catch (error) {
          console.error('Error processing the request:', error.message);
          return res.status(500).json({ message: 'Server error', error: error.message });
        }
      });
      
      
      
  };
   

module.exports = { uploadProfileImage };
