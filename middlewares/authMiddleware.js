// const jwt = require("jsonwebtoken");

// // Middleware to validate JWT and extract user info
// const authenticateToken = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the `Authorization` header

//     if (!token) {
//         return res.status(401).json({ message: "Authorization token is required" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
//         req.user = decoded; // Attach user info (name, email, etc.) to `req.user`
//         next();
//     } catch (error) {
//         return res.status(403).json({ message: "Invalid token", error: error.message });
//     }
// };

// module.exports = authenticateToken;




// <----------------------------This approach is belong to fetch the user information such as user name and email from the backend throught the jwt tooken --------------------------->
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach user data to the request
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateToken };
