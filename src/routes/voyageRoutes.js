const express = require('express');
const router = express.Router();
const Voyage = require('../models/voyage');
const Vessel = require('../models/vessel');
const Container = require('../models/container');

router.post('/', async (req, res) => {
  try {
    const { vessel_id, voyage_number, destination } = req.body;

    if (!vessel_id || !voyage_number || !destination) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'vessel_id, voyage_number and destination are required'
      });
    }

    let vessel;
    try {
      vessel = await Vessel.findById(vessel_id);
    } catch(e) {}
    
    if (!vessel) {
      return res.status(404).json({
        error: 'VESSEL_NOT_FOUND',
        message: `No vessel found with id ${vessel_id}`
      });
    }

    const existing = await Voyage.findOne({ voyage_number });
    if (existing) {
      return res.status(409).json({
        error: 'VOYAGE_ALREADY_EXISTS',
        message: `A voyage with number ${voyage_number} already exists`
      });
    }

    const voyage = new Voyage({ vessel_id, voyage_number, destination });
    await voyage.save();
    
    res.status(201).json(voyage);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

router.post('/:voyage_id/containers', async (req, res) => {
  try {
    const { voyage_id } = req.params;
    const { container_number, destination, due_date, late_charge } = req.body;

    if (!container_number || !destination || !due_date || late_charge === undefined) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'container_number, destination, due_date and late_charge are required'
      });
    }

    if (late_charge <= 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'late_charge must be greater than 0'
      });
    }

    let voyage;
    try {
      voyage = await Voyage.findById(voyage_id).populate('vessel_id');
    } catch(e) {}

    if (!voyage) {
      return res.status(404).json({
        error: 'VOYAGE_NOT_FOUND',
        message: `No voyage found with id ${voyage_id}`
      });
    }

    if (voyage.status !== 'PLANNED') {
      return res.status(409).json({
        error: 'VOYAGE_ALREADY_STARTED',
        message: `Voyage ${voyage.voyage_number} has already sailed, containers cannot be added`
      });
    }

    const existingContainer = await Container.findOne({ container_number });
    if (existingContainer) {
      return res.status(409).json({
        error: 'CONTAINER_ALREADY_EXISTS',
        message: `A container with number ${container_number} already exists`
      });
    }

    const currentContainersCount = await Container.countDocuments({ voyage_id });
    const capacity = voyage.vessel_id.capacity;
    
    if (currentContainersCount >= capacity) {
      return res.status(409).json({
        error: 'CAPACITY_EXCEEDED',
        message: `${voyage.vessel_id.name} can carry only ${capacity} containers on one voyage`
      });
    }

    const container = new Container({
      container_number,
      voyage_id,
      destination,
      due_date,
      late_charge
    });

    await container.save();
    
    res.status(201).json(container);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

module.exports = router;
