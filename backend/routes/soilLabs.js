const express = require('express');
const SoilLab = require('../models/SoilLab');

const router = express.Router();

// GET /api/soil-labs/:state
router.get('/:state', async (req, res) => {
  try {
    const state = req.params.state.toLowerCase();
    // Search with case-insensitive regex for the state field
    const labs = await SoilLab.find({ state: new RegExp(state, 'i') });

    if (labs.length === 0) {
      return res.json({
        success: false,
        message: `No soil testing labs found for ${req.params.state}`,
        data: []
      });
    }

    return res.json({
      success: true,
      state: req.params.state,
      count: labs.length,
      data: labs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch soil labs from database',
      message: error.message
    });
  }
});

// GET /api/soil-labs
router.get('/', async (req, res) => {
  try {
    const allLabs = await SoilLab.find({});
    return res.json({
      success: true,
      totalLabs: allLabs.length,
      data: allLabs,
      note: 'Query specific state using /api/soil-labs/:state',
      availableStates: [...new Set(allLabs.map(l => l.state))]
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch soil labs from database',
      message: error.message
    });
  }
});

module.exports = router;
