const db = require('../config/db'); // Database connection

// Add a new fault code
exports.addFaultCode = async (req, res) => {
  try {
    const { code, description } = req.body;

    if (!code || !description) {
      return res.status(400).json({ error: 'Code and description are required.' });
    }

    await db.execute(
      'INSERT INTO fault_codes (code, description) VALUES (?, ?)',
      [code, description]
    );

    return res.status(201).json({ message: 'Fault code added successfully.' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Fetch all fault codes
exports.getAllFaultCodes = async (req, res) => {
  try {
    const [faultCodes] = await db.execute('SELECT id, code, description FROM fault_codes');

    return res.status(200).json(faultCodes);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update a fault code
exports.updateFaultCode = async (req, res) => {
  try {
    const { id, code, description } = req.body;

    if (!id || !code || !description) {
      return res.status(400).json({ error: 'ID, code, and description are required.' });
    }

    const [result] = await db.execute(
      'UPDATE fault_codes SET code = ?, description = ? WHERE id = ?',
      [code, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fault code not found.' });
    }

    return res.status(200).json({ message: 'Fault code updated successfully.' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Delete a fault code
exports.deleteFaultCode = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required.' });
    }

    const [result] = await db.execute('DELETE FROM fault_codes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fault code not found.' });
    }

    return res.status(200).json({ message: 'Fault code deleted successfully.' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
