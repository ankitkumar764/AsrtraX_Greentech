const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // Ensure we capture everything the user provided (request body)
  inputs: mongoose.Schema.Types.Mixed,
  // Ensure we capture the final structured data returned to the user
  results: mongoose.Schema.Types.Mixed,
  // For backwards compatibility and legacy search (already exists)
  metrics: {
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    ph: Number,
    organicCarbon: Number
  },
  extractedFromText: String,
  recommendations: [{
    cropName: String,
    estimatedYield: mongoose.Schema.Types.Mixed, // Can be String or Object (yieldPotential)
    confidence: Number, // Maps from matchScore
    reasoning: mongoose.Schema.Types.Mixed, // Can be String or Array (as returned by engine)
    npkRequirements: mongoose.Schema.Types.Mixed,
    fertilizerPlan: mongoose.Schema.Types.Mixed,
    financials: mongoose.Schema.Types.Mixed
  }],
  advice: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SoilReport', soilReportSchema);
