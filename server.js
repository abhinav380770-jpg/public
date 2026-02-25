const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connecting using your specific MongoDB Atlas URI
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(() => console.log("✅ Ginger Tea Database Connected!"))
    .catch(err => {
        console.error("❌ Connection Error Detail:", err.message);
        console.log("Tip: Check if your password in .env is correct!");
    });

// Updated Schema to handle both Custom (description) and Cart (items)
const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String }, // Optional for Cart orders
  items: [ { name: String, price: Number } ], // To store the list from the cart
  totalAmount: { type: Number },
  orderDate: { type: String },
  orderTime: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

app.post('/api/orders', async (req, res) => {
  try {
    // Read all fields from the request body
    const { name, email, description, items, totalAmount, orderDate, orderTime } = req.body;
    
    const newOrder = new Order({
      name,
      email,
      description: description || "Cart Order", // Set default if missing
      items,
      totalAmount,
      orderDate,
      orderTime
    });

    await newOrder.save();
    res.status(201).json({ message: '✅ Order saved successfully!' });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});