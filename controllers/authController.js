const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Seller = require("../models/Seller");
const Owner = require("../models/Owner");
const Customer = require("../models/Customer");
const DeliveryBoy = require("../models/DeliveryBoy");

// ------------------------------
// 📦 SELLER: Register & Login
// ------------------------------

// ✅ Seller Register
exports.registerSeller = async (req, res) => {
  try {
    const { username, password, category, pincode } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingSeller = await Seller.findOne({ username });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = new Seller({ username, password: hashedPassword, category, pincode });
    await newSeller.save();

    res.status(201).json({ message: "Seller registered successfully." });
  } catch (err) {
    console.error("Seller Register Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Seller Login
exports.loginSeller = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "All fields required." });
    }

    const seller = await Seller.findOne({ username });
    if (!seller) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Wrong password." });
    }

    const token = jwt.sign({ id: seller._id, role: "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      seller: {
        id: seller._id,
        username: seller.username,
        category: seller.category,
        pincode: seller.pincode
      }
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
};

// ------------------------------
// 🛍️ CUSTOMER: Register & Login
// ------------------------------

exports.customerRegister = async (req, res) => {
  try {
    const { username, password, phone } = req.body;

    if (!username || !password) return res.status(400).json({ message: "All fields are required." });

    const existing = await Customer.findOne({ username });
    if (existing) return res.status(400).json({ message: "Customer already exists." });

    const hash = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({ username, password: hash, phone });
    await newCustomer.save();

    res.status(201).json({ message: "Customer registered successfully." });
  } catch (err) {
    console.error("Customer Register Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

exports.customerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Customer.findOne({ username });

    if (!user) return res.status(404).json({ message: "Customer not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password." });

    const token = jwt.sign({ id: user._id, role: "customer" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      customer: {
        id: user._id,
        username: user.username,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Customer Login Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ------------------------------
// 🚚 DELIVERY BOY: Register & Login
// ------------------------------

exports.deliveryBoyRegister = async (req, res) => {
  try {
    const { username, password, area } = req.body;

    if (!username || !password) return res.status(400).json({ message: "All fields are required." });

    const existing = await DeliveryBoy.findOne({ username });
    if (existing) return res.status(400).json({ message: "Delivery boy already exists." });

    const hash = await bcrypt.hash(password, 10);
    const newBoy = new DeliveryBoy({ username, password: hash, area });
    await newBoy.save();

    res.status(201).json({ message: "Delivery boy registered successfully." });
  } catch (err) {
    console.error("DeliveryBoy Register Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deliveryBoyLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await DeliveryBoy.findOne({ username });
    if (!user) return res.status(404).json({ message: "Not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password." });

    const token = jwt.sign({ id: user._id, role: "delivery" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      deliveryBoy: {
        id: user._id,
        username: user.username,
        area: user.area
      }
    });
  } catch (err) {
    console.error("DeliveryBoy Login Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ------------------------------
// 👑 OWNER: Login only (manual account)
// ------------------------------

exports.loginOwner = async (req, res) => {
  try {
    const { username, password } = req.body;

    const owner = await Owner.findOne({ username });
    if (!owner) return res.status(404).json({ message: "Owner not found." });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password." });

    const token = jwt.sign({ id: owner._id, role: "owner" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      owner: {
        id: owner._id,
        username: owner.username
      }
    });
  } catch (err) {
    console.error("Owner Login Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};
