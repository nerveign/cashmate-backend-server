const xlsx = require('xlsx');
const Income = require('../models/Income');

// Add Income Source
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validation
    if (!source || !amount || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    return res.status(200).json(newIncome);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get All Income Source
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    return res.status(200).json(income);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete Income Source by id
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Income deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Download Excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for excel file
    const data = income.map((item) => ({
      Source: item.source,
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

    xlsx.utils.book_append_sheet(wb, ws, 'Income');
    xlsx.writeFile(wb, 'income_details.xlsx');
    return res.status(200).download('income_details.xlsx');
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
