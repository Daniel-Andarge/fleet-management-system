const express = require('express');
const Vehicle = require('../models/Vehicle');
const router = express.Router();

router.post('/vehicles', async (req, res) => {
  const vehicle = new Vehicle(req.body);
  await vehicle.save();
  res.status(201).send(vehicle);
});

router.put('/vehicles/:id', async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(vehicle);
});

router.get('/vehicles', async (req, res) => {
  const vehicles = await Vehicle.find();
  res.send(vehicles);
});

module.exports = router;
