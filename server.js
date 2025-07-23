const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

dotenv.config();
const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
connectDB();

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/income', incomeRoutes);
app.use('/api/v1/expense', expenseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
