const express = require('express');
const profitEngine = require('../services/profitEngine');

const router = express.Router();

// POST /api/profit-analysis/analyze
router.post('/analyze', (req, res) => {
  try {
    const inputs = req.body;

    if (!inputs.budget || !inputs.landSize) {
      return res.status(400).json({
        error: 'Missing essential inputs',
        message: 'Budget and Land Size are required for profit analysis.'
      });
    }

    const analysis = profitEngine.analyzeProfit(inputs);
    const insights = profitEngine.generateInsights(analysis, inputs.budget);

    return res.json({
      success: true,
      data: {
        analysis,
        insights
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Profit Analysis Error:', error);
    return res.status(500).json({
      error: 'Failed to complete profit analysis',
      message: error.message
    });
  }
});

module.exports = router;
