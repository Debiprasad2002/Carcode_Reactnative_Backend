const db = require("../config/db");

// Fetch all users
const getUsers = async (req, res) => {
  try {
    // Query to fetch required user data
    const query = `SELECT id, profile_picture, name, email, status FROM users`;
    const [rows] = await db.query(query); // db.query is already promise-based

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

module.exports = { getUsers };
