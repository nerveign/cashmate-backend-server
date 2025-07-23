# Cellar Backend Server

CashMate is a personal finance management application that provides a comprehensive solution to financial management problems. With a dashboard feature that displays a complete overview including balance, total income, expenses, and analysis of the last 30 days, users can easily understand their financial condition. This application is equipped with a special page for income and expense that allows users to record every transaction with an accurate timestamp, plus a secure login and register system to protect the privacy of user financial data.

## Setup .env file

```dotenv
MONGO_URI=...       (Mongodb port address)
PORT=...            (your dev port)
JWT_SECRET=...      (add jwt secret key)
```

## Install Dependencies

```bash
npm install
```

## Run the app

```bash
npm run start
```

## Development Mode

```bash
npm run dev
```
