require('dotenv').config();

const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');
const VerificationHistory = require('./models/VerificationHistory');

async function clearDemoData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    const medicines = await Medicine.deleteMany({});
    const history = await VerificationHistory.deleteMany({});

    console.log(`Medicines deleted: ${medicines.deletedCount}`);
    console.log(`Verification history deleted: ${history.deletedCount}`);

    await mongoose.disconnect();

    console.log('Demo data cleared successfully.');
  } catch (error) {
    console.error('Failed to clear demo data:', error);
    process.exitCode = 1;
  }
}

clearDemoData();