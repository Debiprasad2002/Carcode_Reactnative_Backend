const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const diagnosticRoutes = require('./routes/diagnosticRoutes');

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Authentication Routes
app.use('/auth', authRoutes);


//Diagnostic Routes (DTC Doctor)
app.use('/api/diagnostic', diagnosticRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
