const db = require('../config/db'); // Ensure this points to your updated db.js file

// Update car info by registration number
exports.updateCarInfo = async (req, res) => {
    try {
        const { registration, make, model, fault_code, description, is_fixed } = req.body;

        if (!registration) {
            return res.status(400).json({ message: 'Registration number is required to update car info.' });
        }

        const query = `
            UPDATE car_info 
            SET 
                make = COALESCE(?, make),
                model = COALESCE(?, model),
                fault_code = COALESCE(?, fault_code),
                description = COALESCE(?, description),
                is_fixed = COALESCE(?, is_fixed)
            WHERE registration = ?
        `;
        const values = [make, model, fault_code, description, is_fixed, registration];

        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No car info found with the provided registration number.' });
        }

        res.status(200).json({ message: 'Car information updated successfully.' });
    } catch (error) {
        console.error('Error updating car information:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete car info by registration number
exports.deleteCarInfo = async (req, res) => {
    try {
        const { registration } = req.params;

        if (!registration) {
            return res.status(400).json({ message: 'Registration number is required to delete car info.' });
        }

        const query = `
            DELETE FROM car_info 
            WHERE registration = ?
        `;
        const [result] = await db.execute(query, [registration]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No car info found with the provided registration number.' });
        }

        res.status(200).json({ message: 'Car information deleted successfully.' });
    } catch (error) {
        console.error('Error deleting car information:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
