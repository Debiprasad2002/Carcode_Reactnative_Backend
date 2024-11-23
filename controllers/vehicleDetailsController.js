const db = require('../config/db');

// Controller to fetch vehicle information by make, model, and year
// const getVehicleDetails = async (req, res) => {
//   const { make, model, year } = req.query;
//   console.log("Hello get details vehicle")
//   console.log(make , model ,year)
//   // Validate input
//   if (!make || !model || !year) {
//     return res.status(400).json({ message: 'Make, model, and year are required' });
//   }

//   try {

//     if (!make || !model || !year) {
//       return res.status(400).json({ message: 'Make, model, and year are required' });
//     }
  

//     // Query to fetch information from the database
//     // const query = `SELECT information FROM vehicles WHERE make = ?  AND model = ? AND year = ?`;

//     const query = `SELECT information FROM vehicles WHERE make = ? AND model = ? AND year = ?`;
//     const [rows] = await db.execute(query, [make, model, year]);
  
//      console.log("Rows fetched from database:", rows);
//     // // Check if a record was found
//     // if (rows.length === 0) {
//     //   return res.status(404).json({ message: 'No vehicle information found' });
//     // }

//     // // Send the information as a response
//     // return res.status(200).json({ information: rows[0].information });
//   } catch (error) {
//     console.error('Database error:', error.message);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };






const getVehicleDetails = async (req, res) => {
  const { make, model, year } = req.query;
  console.log("Hello, get details vehicle");
  const years = parseInt(req.query.year, 10);

  if (!make || !model || !year) {
    return res.status(400).json({ message: 'Make, model, and year are required' });
  }

  try {
    const query = `SELECT *  FROM vehicles  WHERE 1 `;
    const  result  = await db.execute(query);
    console.log(result)

    // Log the query result for debugging
    // console.log("Query result:", rows);

    // Access the rows property directly
    const rows = result._rows || []; 
    console.log("Rows fetched:", rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No vehicle information found' });
    }

    // return res.status(200).json({ information: rows[0].information });
  } catch (error) {
    console.error("Database execution error:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};





module.exports = { getVehicleDetails };
