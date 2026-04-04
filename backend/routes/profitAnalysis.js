const express = require('express');
const profitEngine = require('../services/profitEngine');
const History = require('../models/History');

const router = express.Router();

// POST /api/profit-analysis/analyze
router.post('/analyze', async (req, res) => {
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

    const result = {
      success: true,
      data: {
        analysis,
        insights
      },
      timestamp: new Date().toISOString()
    };

    // Save to MongoDB History
    try {
      const historyEntry = new History({
        type: 'profit-analysis',
        inputs: req.body, // Store complete form input
        results: result    // Store complete server response
      });
      console.log('💾 Saving Profit Analysis to DB:', JSON.stringify(inputs, null, 2));
      await historyEntry.save();
      console.log('✅ Profit analysis saved to MongoDB (Inputs & Results)');
    } catch (saveError) {
      console.error('❌ Failed to save profit analysis:', saveError.message);
    }

    return res.json(result);
  } catch (error) {
    console.error('Profit Analysis Error:', error);
    return res.status(500).json({
      error: 'Failed to complete profit analysis',
      message: error.message
    });
  }
});

module.exports = router;
