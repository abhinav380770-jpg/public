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

// --- SCHEMAS ---

// 1. User Schema for Login/Signup
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Plain text for now; use hashing in production
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

// 2. Order Schema (Updated for Cart & Custom)
const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String }, 
  items: [ { name: String, price: Number } ], 
  totalAmount: { type: Number },
  orderDate: { type: String },
  orderTime: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// --- ROUTES ---

// 1. Signup Route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create account" });
  }
});

// 2. Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email } });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 3. Orders Route (Handles Custom & Cart)
app.post('/api/orders', async (req, res) => {
  try {
    const { name, email, description, items, totalAmount, orderDate, orderTime } = req.body;
    
    const newOrder = new Order({
      name,
      email,
      description: description || "Cart Order",
      items: items || [],
      totalAmount: totalAmount || 0,
      orderDate,
      orderTime
    });

    await newOrder.save();
    res.status(201).json({ message: '✅ Order saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});