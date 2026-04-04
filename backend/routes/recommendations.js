const express = require('express');
const recommendationEngine = require('../services/recommendationEngine');
const History = require('../models/History');
const SoilReport = require('../models/SoilReport');

const router = express.Router();
// ... (rest of the file content until updated logic)

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

    const result = {
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    };

    // Save to MongoDB History
    try {
      const historyEntry = new History({
        type: 'questionnaire',
        inputs: req.body, // Store complete form input
        results: result    // Store complete server response
      });
      console.log('💾 Saving Recommendations to DB:', JSON.stringify(inputs, null, 2));
      await historyEntry.save();
      console.log('✅ Recommendations saved to MongoDB (Inputs & Results)');
    } catch (saveError) {
      console.error('❌ Failed to save recommendations:', saveError.message);
    }

    return res.json(result);
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

    const result = {
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
    };

    // Save to MongoDB History (Questionnaire section for recommendations)
    try {
      const historyEntry = new History({
        type: 'questionnaire',
        inputs: req.body, // Store complete form input
        results: result    // Store complete server response
      });
      console.log('💾 Saving Soil-based Recommendations to History DB:', JSON.stringify(inputs, null, 2));
      await historyEntry.save();
      console.log('✅ Soil-based recommendations saved to History collection');
    } catch (saveError) {
      console.error('❌ Failed to save soil recommendations to History:', saveError.message);
    }

    // ✅ ALSO Save to SoilReport collection (Primary record for soil analysis)
    try {
      const newSoilReport = new SoilReport({
        inputs: req.body,
        results: result,
        metrics: {
          nitrogen: soilN,
          phosphorus: soilP,
          potassium: soilK,
          ph: pH
        },
        recommendations: result.recommendations.map(r => ({
          cropName: r.cropName,
          confidence: r.matchScore,
          reasoning: r.reasoning,
          estimatedYield: r.estimatedYield,
          npkRequirements: r.npkRequirements,
          fertilizerPlan: r.fertilizerPlan,
          financials: r.financials
        })),
        advice: result.generalAdvice.join(', ')
      });
      
      console.log('💾 Saving Complete Soil Report to soilreports collection...');
      await newSoilReport.save();
      console.log('✅ Full Soil Analysis with Recommendations saved to MongoDB!');
    } catch (saveError) {
      console.error('❌ Failed to save SoilReport document:', saveError.message);
    }

    return res.json(result);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Failed to process soil report',
      message: error.message
    });
  }
});

module.exports = router;
