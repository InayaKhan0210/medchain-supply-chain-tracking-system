const mongoose = require('mongoose')

const transferHistorySchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  fromOwner: {
    type: String,
    required: true
  },
  toOwner: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  transferredAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('TransferHistory', transferHistorySchema)