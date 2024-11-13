const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register user
// Register user
exports.registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, agreeToEULA } = req.body;

  // Check if all fields are filled
  if (!name || !email || !password || !confirmPassword || !agreeToEULA) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if user agreed to the EULA
  if (!agreeToEULA) {
    return res.status(400).json({ message: 'You must agree to the EULA' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login user

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check for missing email or password
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Log the email and password being checked
  console.log("Email provided:", email);
  console.log("Password provided:", password);

  // Query database for user with matching email
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    // Check for database error or no user found
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      console.log("No user found with this email");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    console.log("Database password hash:", user.password); // Log hashed password from DB

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password mismatch"); // Log if password check fails
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    try {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log("JWT generated successfully"); // Log JWT success
      return res.status(200).json({ message: 'Login successful', token });
    } catch (tokenError) {
      console.error("JWT generation error:", tokenError); // Log JWT error
      return res.status(500).json({ message: 'Token generation failed' });
    }
  });
};


