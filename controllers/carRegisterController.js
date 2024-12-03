const db = require('../config/db'); // Ensure this points to the updated db.js file

exports.registerCarInfo = async (req, res) => {
    try {
        const { registration, make, model, fault_code, description, is_fixed } = req.body;

        // Default `is_fixed` to 0 if not provided
        const fixedStatus = is_fixed || 0;

        // Validate required fields
        if (!registration || !make || !model || !fault_code || !description) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Insert data into the database
        const query = `
            INSERT INTO car_info (registration, make, model, fault_code, description, is_fixed)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [registration, make, model, fault_code, description, fixedStatus];

        await db.execute(query, values);

        res.status(201).json({ message: 'Car information registered successfully.' });
    } catch (error) {
        console.error('Error registering car information:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
