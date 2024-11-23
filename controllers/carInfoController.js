// controllers/carInfoController.js

const pool = require('../config/db');

// Fetch all data from car_info table
const getAllCarInfo = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, registration, make, model, is_fixed FROM car_info");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No car information found" });
    }

    // Format response
    const formattedData = rows.map(row => ({
      ID: row.id,
      Registration: row.registration,
      Make: row.make,
      Model: row.model,
      Fixed: row.is_fixed === 1 ? "✔" : "✘"
    }));

    res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllCarInfo };
