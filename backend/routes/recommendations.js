const express = require('express');
const recommendationEngine = require('../services/recommendationEngine');

const router = express.Router();

// POST /api/recommendations/get
router.post('/get', async (req, res) => {
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
    const recommendations = await recommendationEngine.generateRecommendations(inputs);

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
router.post('/soil-report', async (req, res) => {
  try {
    const inputs = req.body;
    const { soilN, soilP, soilK, pH } = inputs;

    if (!soilN || !soilP || !soilK || !pH) {
      return res.status(400).json({
        error: 'Missing soil parameters',
        required: ['soilN', 'soilP', 'soilK', 'pH']
      });
    }

    // Use the recommendation engine to generate top crops based on inputs
    // isSoilReport flag set to true
    const recommendations = await recommendationEngine.generateRecommendations(inputs, true);
    
    if (!recommendations.success || !recommendations.recommendations || recommendations.recommendations.length === 0) {
      return res.status(400).json({
        error: recommendations.message || 'Could not find suitable crops for your conditions'
      });
    }

    return res.json({
      success: true,
      soilAnalysis: {
        nitrogen: soilN,
        phosphorus: soilP,
        potassium: soilK,
        pH: pH
      },
      recommendations: recommendations.recommendations, // top crops array
      landArea: recommendations.landArea,
      soilHealth: recommendations.soilHealth,
      confidenceLevel: recommendations.confidenceLevel,
      warning: recommendations.warning,
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
