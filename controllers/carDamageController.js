const db = require('../config/db');

// Add a new damage report
exports.addDamageReport = async (req, res) => {
    try {
        const {
            registration,
            make,
            model,
            damage_side,
            damage_type,
            damage_category,
            description,
        } = req.body;

        // Validate required fields
        if (!registration || !make || !model || !damage_side || !damage_type || !damage_category) {
            return res.status(400).json({
                message: 'All fields (registration, make, model, damage_side, damage_type, damage_category) are required.',
            });
        }

        // Insert data into the database
        const query = `
            INSERT INTO car_damage_report (registration, make, model, damage_side, damage_type, damage_category, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            registration,
            make,
            model,
            damage_side,
            damage_type,
            damage_category,
            description || null,
        ]);

        res.status(201).json({
            message: 'Car damage report added successfully.',
            // reportId: result.insertId,
        });
    } catch (error) {
        console.error('Error adding damage report:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all damage reports or a specific one
exports.getDamageReports = async (req, res) => {
    try {
        const { registration } = req.query;

        let query = 'SELECT * FROM car_damage_report';
        const values = [];

        // If registration is provided, filter by it
        if (registration) {
            query += ' WHERE registration = ?';
            values.push(registration);
        }

        const [rows] = await db.execute(query, values);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching damage reports:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
