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
    name: String,
    email: String,
    category: String,
    description: String,
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Endpoint to receive orders from the frontend
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save order to MongoDB" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});