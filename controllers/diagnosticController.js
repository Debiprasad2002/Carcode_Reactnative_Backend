// controllers/diagnosticController.js

const db = require('../config/db');

exports.getSolutionByCode = (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Error code is required' });
  }

  const query = 'SELECT description FROM fault_codes WHERE code = ?';
  
  db.query(query, [code], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No solution found for the given error code' });
    }

    res.status(200).json({
      message: 'Solution found',
      solutions: results.map(result => ({ option: result.description }))
    });
  });
};
