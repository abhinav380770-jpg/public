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

// Schema for Crochet Orders
const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },        // New field for the customer's name
  email: { type: String, required: true },       // New field for their contact info
  description: { type: String, required: true }, // The crochet request
  orderDate: { type: String },                   // For readable date (e.g., 24/02/2026)
  orderTime: { type: String },                   // For readable time (e.g., 07:15 PM)
  createdAt: { type: Date, default: Date.now }   // Keeps the raw timestamp for sorting
});

const Order = mongoose.model('Order', OrderSchema);

// Endpoint to receive orders from the frontend
app.post('/api/orders', async (req, res) => {
  try {
    const { name, email, description, orderDate, orderTime } = req.body;
    
    const newOrder = new Order({
      name,
      email,
      description,
      orderDate,
      orderTime
    });

    await newOrder.save();
    res.status(201).json({ message: '✅ Order saved to Ginger Tea database!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});