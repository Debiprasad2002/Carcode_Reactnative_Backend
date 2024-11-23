const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const diagnosticRoutes = require('./routes/diagnosticRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const vehicleDetailsRoutes = require('./routes/vehicleDetailsRoutes');
const carInfoRoutes = require('./routes/carInfoRoutes');
const contactRoutes = require('./routes/contactRoutes');



dotenv.config();
const app = express();
app.use(bodyParser.json());

// Authentication Routes
app.use('/auth', authRoutes);


//Diagnostic Routes (DTC Doctor)
app.use('/api/diagnostic', diagnosticRoutes);

//Vehicle Routes
app.use('/api', vehicleRoutes);

//vehicledetails Routes
app.use('/api/vehicle-details', vehicleDetailsRoutes);


//view data features
app.use('/api', carInfoRoutes);


// Use the contact routes
app.use('/api', contactRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
