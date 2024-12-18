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
const carDamageRoutes = require('./routes/carDamageRoutes');
const otpPasswordRoutes = require('./routes/otpPasswordRoutes');
const carCommentRoutes = require('./routes/carCommentRoutes'); // Import carComment route
const chatRoutes = require('./routes/chatRoutes');
const blogRoutes = require('./routes/blogRoutes');
const faultCodeRoutes = require('./routes/faultCodeRoutes');
const userRoutes = require('./routes/userRoutes');



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

app.use('/uploads/chatimage', express.static('uploads/chatimage'));

app.use('/uploads/blogimage', express.static(path.join(__dirname, 'uploads/blogimage')));





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


// Use the damage report routes
app.use('/api/car-damage', carDamageRoutes);

//for the password reset feature 
app.use('/api/password', otpPasswordRoutes);


 // Register carComment routes
app.use('/api', carCommentRoutes); // Register carComment routes


// Chat routes
app.use('/api/chat', chatRoutes);





// <-------------------------------------------------ADMIN GHUMU  PANNEL ROUTES -------------------------------------------------------------------------------->

//  Blog Routes
app.use('/api/blogs', blogRoutes);



//  Fault code Routes
app.use('/api', faultCodeRoutes);


// Block and unblock Routes
app.use('/api', userRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


