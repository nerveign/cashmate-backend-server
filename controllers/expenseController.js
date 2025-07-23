const xlsx = require('xlsx');
const Expense = require('../models/Expense');

// Add Expense Source
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // Validation
    if (!category || !amount || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    return res.status(200).json(newExpense);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get All Expense Source
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    return res.status(200).json(expense);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete Expense Source by id
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for excel file
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    ws['!cols'] = [
      { wch: 15 }, // Source
      { wch: 15 }, // Amount
      { wch: 15 }, // Date
    ];

    xlsx.utils.book_append_sheet(wb, ws, 'expense');
    xlsx.writeFile(wb, 'expense_details.xlsx');
    return res.status(200).download('expense_details.xlsx');
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
