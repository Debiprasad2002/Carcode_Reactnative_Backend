const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const diagnosticRoutes = require('./routes/diagnosticRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const vehicleDetailsRoutes = require('./routes/vehicleDetailsRoutes');
const carInfoRoutes = require('./routes/carInfoRoutes');
const contactRoutes = require('./routes/contactRoutes');
const profileRoutes = require('./routes/profileRoutes');
const profileImageRoutes = require('./routes/profileImageRoutes');
const carRegisterRoutes = require('./routes/carRegisterRoutes');
const carRegisterCrudRoutes = require('./routes/carRegisterCrudRoutes');
const carRegisterDeleteRoutes = require('./routes/carRegisterDeleteRoutes');

const path = require('path'); // Add this line to import the path module

 // Import the profile page routes

//// Middleware
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));






// Authentication Routes
app.use('/auth', authRoutes);


//Diagnostic Routes (DTC Doctor)
app.use('/api/diagnostic', diagnosticRoutes);

//Vehicle Routes
app.use('/api', vehicleRoutes);

//vehicledetails Routes
app.use("/api/vehicles", vehicleDetailsRoutes);


//view data features
app.use('/api', carInfoRoutes);


// Use the contact routes
app.use('/api', contactRoutes);

// Profile pageRoutes
// app.use("/api/profile", profileRoutes);

//Approach 2 profile page routes 
app.use("/api/user", profileRoutes);


// Profile Image Routes
app.use('/api/profile', profileImageRoutes);


// Car Register Routes
app.use('/api/car-register', carRegisterRoutes);



//Car_info crud operation
app.use('/api/car-crud', carRegisterCrudRoutes);


//car_info page delete api 
// Use the delete routes
app.use('/api/car-delete', carRegisterDeleteRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


