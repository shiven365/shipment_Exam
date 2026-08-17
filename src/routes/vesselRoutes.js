const express = require('express');
const router = express.Router();
const Vessel = require('../models/vessel');

router.post('/', async (req, res) => {
  try {
    const { name, vessel_number, capacity } = req.body;

    if (!name || !vessel_number || capacity === undefined) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'name, vessel_number and capacity are required'
      });
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'capacity must be a whole number greater than 0'
      });
    }

    const existing = await Vessel.findOne({ vessel_number });
    if (existing) {
      return res.status(409).json({
        error: 'VESSEL_ALREADY_EXISTS',
        message: `A vessel with number ${vessel_number} already exists`
      });
    }

    const vessel = new Vessel({ name, vessel_number, capacity });
    await vessel.save();
    
    res.status(201).json(vessel);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

module.exports = router;
