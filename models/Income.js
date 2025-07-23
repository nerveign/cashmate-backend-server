const mongoose = require('mongoose');

const IncomeSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    icon: { type: String },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { Timestamp: true }
);

module.exports = mongoose.model('Income', IncomeSchema);
