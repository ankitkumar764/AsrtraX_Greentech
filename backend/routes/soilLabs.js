const express = require('express');
const soilLabs = require('../data/soilLabs');

const router = express.Router();

// GET /api/soil-labs/:state
router.get('/:state', (req, res) => {
  try {
    const state = req.params.state.toLowerCase().replace(/\s+/g, '_');
    const labs = soilLabs[state] || [];

    if (labs.length === 0) {
      return res.json({
        success: false,
        message: `No soil testing labs found for ${req.params.state}`,
        data: [],
        note: 'Available states: maharashtra, uttar_pradesh, karnataka'
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
      error: 'Failed to fetch soil labs',
      message: error.message
    });
  }
});

// GET /api/soil-labs
router.get('/', (req, res) => {
  try {
    const allLabs = Object.values(soilLabs).flat();
    return res.json({
      success: true,
      totalLabs: allLabs.length,
      data: allLabs,
      note: 'Query specific state using /api/soil-labs/:state',
      availableStates: Object.keys(soilLabs).map(s => s.replace(/_/g, ' '))
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch soil labs',
      message: error.message
    });
  }
});

module.exports = router;
