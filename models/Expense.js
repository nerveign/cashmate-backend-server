const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    icon: { type: String },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { Timestamp: true }
);

module.exports = mongoose.model('Expense', ExpenseSchema);
