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
    const { soilN, soilP, soilK, pH, season, crop, budget, landArea } = req.body;
    const area = parseFloat(landArea) || 1;

    if (!soilN || !soilP || !soilK || !pH) {
      return res.status(400).json({
        error: 'Missing soil parameters',
        required: ['soilN', 'soilP', 'soilK', 'pH']
      });
    }

    if (!crop) {
      return res.status(400).json({
        error: 'Crop name is required'
      });
    }

    // Calculate NPK requirements
    const npk = recommendationEngine.calculateNPK(crop, soilN, soilP, soilK, pH);
    const fertilizer = recommendationEngine.recommendFertilizers(crop, npk, budget, area);
    const financials = recommendationEngine.calculateFinancials(crop, fertilizer.totalCost, area);

    return res.json({
      success: true,
      crop,
      area,
      soilAnalysis: {
        nitrogen: soilN,
        phosphorus: soilP,
        potassium: soilK,
        pH: pH
      },
      npkRequirements: npk,
      fertilizerPlan: fertilizer,
      financials: financials,
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
