const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { isValidObjectId, Types } = require('mongoose');

// Dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch total Incomes and Expenses
    const totalIncome = await Income.aggregate([{ $match: { userId: userObjectId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    console.log('Total Income', { totalIncome, userId: isValidObjectId(userId) });

    const totalExpense = await Expense.aggregate([{ $match: { userId: userObjectId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    console.log('Total Expense', { totalExpense, userId: isValidObjectId(userId) });

    // Get income transaction in the last 60 days
    const last30DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total incomes in the last 60 days
    const incomesLast30Days = last30DaysIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    // Get expense transactions in the last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const expensesLast30Days = last30DaysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    // Fetch last 5 transactions
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
        ...txn.toObject(),
        type: 'income',
      })),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
        ...txn.toObject(),
        type: 'expense',
      })),
    ].sort((a, b) => b.date - a.date);

    // res
    res.status(200).json({
      totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last30DaysIncome: {
        total: incomesLast30Days,
        transactions: last30DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', err });
  }
};
