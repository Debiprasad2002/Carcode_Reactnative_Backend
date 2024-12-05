const db = require('../config/db'); // Import the database connection

// Function to add a damage report
exports.addDamageReport = async (req, res) => {
    try {
        const {
            car_id = null, // Optional
            userid = null, // Optional
            damage_type,
            damage_category,
            description,
            damage_side
        } = req.body;

        // Validate mandatory fields
        if (!damage_type || !damage_category || !description || !damage_side) {
            return res.status(400).json({
                message: "All mandatory fields (damage_type, damage_category, description, damage_side) are required.",
            });
        }

        // Insert data into the damage_report table
        const [result] = await db.execute(
            `INSERT INTO damage_report (car_id, userid, damage_type, damage_category, description, damage_side) VALUES (?, ?, ?, ?, ?, ?)`,
            [car_id, userid, damage_type, damage_category, description, damage_side]
        );

        res.status(201).json({
            message: "Damage report added successfully",
            // report_id: result.insertId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
