const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  id: Number,
  name: {
    en: String,
    hi: String,
    gu: String
  },
  description: {
    en: String,
    hi: String,
    gu: String
  },
  category: String,
  categoryLabel: {
    en: String,
    hi: String,
    gu: String
  },
  eligibility: {
    en: String,
    hi: String,
    gu: String
  },
  premium: {
    en: String,
    hi: String,
    gu: String
  },
  benefits: {
    en: String,
    hi: String,
    gu: String
  },
  link: String,
  state: {
    en: { type: String, default: 'All India' },
    hi: String,
    gu: String
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scheme', schemeSchema);
