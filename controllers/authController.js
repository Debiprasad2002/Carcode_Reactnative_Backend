const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register user
exports.registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, agreeToEULA } = req.body;
  console.log("Register API hit, Request body:", req.body);


  try {
    // Log API hit
    console.log("Register API hit");

    // Validation
    if (!name || !email || !password || !confirmPassword || !agreeToEULA) {
      console.log("Validation error: Missing fields");
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      console.log("Validation error: Passwords do not match");
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (!agreeToEULA) {
      console.log("Validation error: EULA not agreed");
      return res.status(400).json({ message: 'You must agree to the EULA' });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Inserting user into database...");
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [name, email, hashedPassword]);

    console.log("User registered successfully:", result);
    res.status(201).json({ message: 'User registered successfully' });
    

  } catch (error) {
    console.error("Server error during registration:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log API hit
    console.log("Login API hit");

    // Validation
    if (!email || !password) {
      console.log("Validation error: Missing fields");
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log("Looking up user by email:", email);
    const query = 'SELECT * FROM users WHERE email = ?';
    const [results] = await db.query(query, [email]);

    if (results.length === 0) {
      console.log("No user found with this email");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    console.log("User found:", user);

    console.log("Validating password...");
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Password mismatch");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("Generating JWT...");
    // Include name and email in the JWT token payload
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Login successful, token generated");
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error("Server error during login:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
