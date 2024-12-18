const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const vehicleRoutes = require('./routes/vehicleRoutes');

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/routes', vehicleRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Vehicle Management API!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
