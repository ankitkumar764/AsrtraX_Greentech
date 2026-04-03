const express = require('express');
const recommendationEngine = require('../services/recommendationEngine');

const router = express.Router();

// POST /api/recommendations/get
router.post('/get', (req, res) => {
  try {
    const inputs = req.body;

    // Validate required inputs
    if (!inputs.season && !inputs.soilType) {
      return res.status(400).json({
        error: 'Missing required inputs',
        requiredFields: ['season', 'soilType'],
        message: 'Please provide either season or soil type'
      });
    }

    // Generate recommendations
    const recommendations = recommendationEngine.generateRecommendations(inputs);

    return res.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
});

// POST /api/recommendations/soil-report
router.post('/soil-report', (req, res) => {
  try {
    const { soilN, soilP, soilK, pH, organicCarbon, budget } = req.body;

    if (!soilN || !soilP || !soilK || !pH) {
      return res.status(400).json({
        error: 'Missing soil parameters',
        required: ['soilN', 'soilP', 'soilK', 'pH']
      });
    }

    // Pass all parameters to the engine to automatically deduce the best crops
    const inputs = {
      soilN: parseFloat(soilN),
      soilP: parseFloat(soilP),
      soilK: parseFloat(soilK),
      pH: parseFloat(pH),
      organicCarbon: organicCarbon ? parseFloat(organicCarbon) : undefined,
      budget: budget ? parseFloat(budget) : undefined
    };

    const recommendations = recommendationEngine.generateRecommendations(inputs);

    return res.json({
      success: true,
      soilAnalysis: {
        nitrogen: inputs.soilN,
        phosphorus: inputs.soilP,
        potassium: inputs.soilK,
        pH: inputs.pH,
        organicCarbon: inputs.organicCarbon
      },
      topCrops: recommendations.recommendations, // This holds the array of top 3 crops with their individual fertilizer plans
      generalAdvice: recommendations.generalAdvice,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Failed to process soil report',
      message: error.message
    });
  }
});

module.exports = router;
