const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const vehicleRoutes = require('./routes/vehicleRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if MongoDB connection fails
  });

// Routes
app.use('/routes', vehicleRoutes); // Base path for vehicle routes

// Root Route for Testing
app.get('/', (req, res) => {
  res.send('Welcome to the Vehicle Management API!');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
