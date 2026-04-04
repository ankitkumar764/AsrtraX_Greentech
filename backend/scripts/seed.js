const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Scheme = require('../models/Scheme');
const SoilLab = require('../models/SoilLab');
const schemesData = require('../data/schemes');
const soilLabsData = require('../data/soilLabs');

// Default to krishiai as per recent user request
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/krishiai';

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Seed Schemes
    await Scheme.deleteMany({});
    await Scheme.insertMany(schemesData);
    console.log(`✅ Seeded ${schemesData.length} schemes`);

    // Seed Soil Labs
    await SoilLab.deleteMany({});
    const labsToInsert = [];
    Object.keys(soilLabsData).forEach(state => {
      soilLabsData[state].forEach(lab => {
        labsToInsert.push({
          ...lab,
          state: state // Ensure state is stored correctly
        });
      });
    });
    await SoilLab.insertMany(labsToInsert);
    console.log(`✅ Seeded ${labsToInsert.length} soil labs`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
