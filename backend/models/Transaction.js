const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  paymentMethod: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
