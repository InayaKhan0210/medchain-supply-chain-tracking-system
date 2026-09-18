const mongoose = require('mongoose')

const verificationHistorySchema = new mongoose.Schema({
  medicineId: {
    type: String,
    required: true
  },
  medicineName: {
    type: String,
    default: ''
  },
  batchNumber: {
    type: String,
    default: ''
  },
  manufacturer: {
    type: String,
    default: ''
  },
  result: {
    type: String,
    enum: ['AUTHENTIC', 'SUSPICIOUS', 'COUNTERFEIT'],
    required: true
  },
  verifiedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('VerificationHistory', verificationHistorySchema)