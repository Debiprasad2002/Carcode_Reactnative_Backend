const db = require('../config/db'); // Ensure this points to your updated db.js file

// Delete car info based on provided data
exports.deleteCarInfo = async (req, res) => {
    try {
        const { registration, make, model, fault_code, description, is_fixed } = req.body;

        // Ensure required data is provided
        if (!registration || !make || !model || !fault_code || !description || is_fixed === undefined) {
            return res.status(400).json({ 
                message: 'All fields (registration, make, model, fault_code, description, and is_fixed) are required to delete the data.' 
            });
        }

        const query = `
            DELETE FROM car_info 
            WHERE registration = ? AND make = ? AND model = ? AND fault_code = ? AND description = ? AND is_fixed = ?
        `;
        const values = [registration, make, model, fault_code, description, is_fixed];

        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No matching car info found to delete.' });
        }

        res.status(200).json({ message: 'Car information deleted successfully.' });
    } catch (error) {
        console.error('Error deleting car information:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
