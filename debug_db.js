const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const History = require('./backend/models/History');
const SoilReport = require('./backend/models/SoilReport');

const checkDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log(`Connecting to: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    const histories = await History.find({}).sort({ timestamp: -1 }).limit(3);
    const reports = await SoilReport.find({}).sort({ timestamp: -1 }).limit(3);

    console.log(`\nFound ${histories.length} history entries:`);
    histories.forEach((h, i) => {
        console.log(`\n[History ${i+1}] type: ${h.type}, date: ${h.timestamp}`);
        console.log(`Inputs exists: ${!!h.inputs}, Results exists: ${!!h.results}`);
        if(h.inputs) console.log('Inputs snippet:', JSON.stringify(h.inputs).substring(0, 100));
    });

    console.log(`\nFound ${reports.length} soil report entries:`);
    reports.forEach((r, i) => {
        console.log(`\n[Report ${i+1}] date: ${r.timestamp}`);
        console.log(`Inputs exists: ${!!r.inputs}, Results exists: ${!!r.results}`);
        if(r.inputs) console.log('Inputs snippet:', JSON.stringify(r.inputs).substring(0, 100));
    });

    process.exit(0);
  } catch (err) {
    console.error('Error in check script:', err);
    process.exit(1);
  }
};

checkDB();
