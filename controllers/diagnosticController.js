const db = require('../config/db');  // Ensure you're importing the promise version

exports.getSolutionByCode = async (req, res) => {
  try {
    // Log when the API endpoint is hit
    console.log('API endpoint hit');

    // Extract the code from the request body
    const { code } = req.body;
    console.log('Received code:', code); // Log received code

    // Validate if code exists
    if (!code) {
      console.log('Error: No code provided');
      return res.status(400).json({ message: 'Error code is required' });
    }

    const query = 'SELECT description FROM fault_codes WHERE code = ?';

    // Log before query execution
    console.log('Query execution started');

    // Execute the query using async/await
    const [results] = await db.query(query, [code]);  // Use the await keyword here

    // Log the query result
    console.log('Database query result:', results);

    // Handle the case where no results are found
    if (results.length === 0) {
      console.log('No solution found for the given code');
      return res.status(404).json({ message: 'No solution found for the given error code' });
    }

    // Log the solution found
    console.log('Solution found:', results[0].description);

    // Send the response
    res.status(200).json({
      message: 'Solution found',
      solutions: results.map(result => ({ option: result.description }))
    });

    // Log after the response is sent
    console.log('Response sent successfully');
  } catch (err) {
    // If an error occurs during the process, log and respond with an error message
    console.error('Error during API call:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
    });
  }
};
