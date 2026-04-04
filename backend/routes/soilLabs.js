const express = require('express');
const soilLabsData = require('../data/soilLabs');

const router = express.Router();

// GET /api/soil-labs/:state
router.get('/:state', async (req, res) => {
  try {
    const state = req.params.state.toLowerCase();
    console.log(`🔍 [File Query] Requested State: ${state}`);
    
    // The keys in soilLabs.js are already lowercase snake_case (e.g. "maharashtra")
    const labs = soilLabsData[state] || [];
    
    console.log(`✅ [File Query] Found ${labs.length} labs for ${state}`);

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
      error: 'Failed to fetch soil labs from file',
      message: error.message
    });
  }
});

// GET /api/soil-labs
router.get('/', async (req, res) => {
  try {
    // Flatten all labs from all states into one array
    const allLabs = Object.values(soilLabsData).flat();
    
    return res.json({
      success: true,
      totalLabs: allLabs.length,
      data: allLabs,
      note: 'Query specific state using /api/soil-labs/:state',
      availableStates: Object.keys(soilLabsData)
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch soil labs from file',
      message: error.message
    });
  }
});

module.exports = router;

module.exports = router;
