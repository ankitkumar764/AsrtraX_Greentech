const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const History = require('./backend/models/History');
const SoilReport = require('./backend/models/SoilReport');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to: ${process.env.MONGODB_URI}`);

    const historyCount = await History.countDocuments();
    const soilReportCount = await SoilReport.countDocuments();

    console.log(`History count: ${historyCount}`);
    console.log(`SoilReport count: ${soilReportCount}`);

    if (historyCount > 0) {
      const lastHistory = await History.findOne().sort({ timestamp: -1 });
      console.log('Last History entry:', JSON.stringify(lastHistory, null, 2));
    }

    if (soilReportCount > 0) {
      const lastReport = await SoilReport.findOne().sort({ timestamp: -1 });
      console.log('Last SoilReport entry:', JSON.stringify(lastReport, null, 2));
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDB();
