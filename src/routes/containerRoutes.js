const express = require('express');
const router = express.Router();
const Container = require('../models/container');

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { arrived_on } = req.body;

    const container = await Container.findById(id);
    if (!container) {
      return res.status(404).json({
        error: 'CONTAINER_NOT_FOUND',
        message: `No container found with id ${id}`
      });
    }

    if (arrived_on !== undefined) {
      container.arrived_on = arrived_on;
    }

    await container.save();
    res.status(200).json(container);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const container = await Container.findById(id);
    if (!container) {
      return res.status(404).json({
        error: 'CONTAINER_NOT_FOUND',
        message: `No container found with id ${id}`
      });
    }
    res.status(200).json(container);
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

module.exports = router;
