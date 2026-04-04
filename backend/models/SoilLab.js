const mongoose = require('mongoose');

const soilLabSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true
  },
  location: String,
  address: String,
  phone: String,
  email: String,
  state: {
    type: String,
    required: true
  },
  distance: Number,
  testCost: Number,
  turnaround: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SoilLab', soilLabSchema);
