const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  type: {
    type: String,
    enum: ['profit-analysis', 'weather-lookup', 'voice-assistant', 'questionnaire'],
    required: true
  },
  inputs: mongoose.Schema.Types.Mixed, // Capture user's form input
  results: mongoose.Schema.Types.Mixed, // Capture full server response
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', historySchema);
