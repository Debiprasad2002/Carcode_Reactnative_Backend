const db = require('../config/db'); // Ensure this points to your database configuration file

// Delete car info based on provided data
exports.deleteCarInfo = async (req, res) => {
    try {
        const { registration, make, model, fault_code, description, is_fixed } = req.body;

        // Ensure mandatory fields are provided
        if (!registration || !make || !model) {
            return res.status(400).json({
                message: 'Fields registration, make, and model are required to delete the data.',
            });
        }

        // Base query for mandatory fields
        let query = `
            DELETE FROM car_info 
            WHERE registration = ? AND make = ? AND model = ?
        `;
        const values = [registration, make, model];

        // Append conditions for optional fields if they are provided
        if (fault_code) {
            query += ' AND fault_code = ?';
            values.push(fault_code);
        }
        if (description) {
            query += ' AND description = ?';
            values.push(description);
        }
        if (is_fixed !== undefined) {
            query += ' AND is_fixed = ?';
            values.push(is_fixed);
        }

        // Execute the query
        const [result] = await db.execute(query, values);

        // Check if a row was deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No matching car info found to delete.' });
        }

        // Successful deletion
        res.status(200).json({ message: 'Car information deleted successfully.' });
    } catch (error) {
        console.error('Error deleting car information:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
