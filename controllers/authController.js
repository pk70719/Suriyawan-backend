const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Seller = require("../models/Seller");
const Owner = require("../models/Owner");
const Customer = require("../models/Customer");
const DeliveryBoy = require("../models/DeliveryBoy");

const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ----------------------------------
// 👑 OWNER LOGIN
// ----------------------------------
exports.loginOwner = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: "Username & password required" });

    const owner = await Owner.findOne({ username });
    if (!owner)
      return res.status(404).json({ success: false, message: "Owner not found" });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = createToken({ username, role: "owner" });

    res.status(200).json({
      success: true,
      message: "✅ लॉगिन सफल!",
      token,
      owner: { id: owner._id, username: owner.username },
    });
  } catch (err) {
    console.error("Owner Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------------------------
// 🧑‍💼 SELLER REGISTER & LOGIN
// ----------------------------------
exports.registerSeller = async (req, res) => {
  try {
    const { username, password, category, pincode } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "All fields are required." });

    const exists = await Seller.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "Seller already exists." });

    const hash = await bcrypt.hash(password, 10);
    const newSeller = new Seller({ username, password: hash, category, pincode });
    await newSeller.save();

    res.status(201).json({ message: "Seller registered successfully." });
  } catch (err) {
    console.error("Seller Register Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

exports.loginSeller = async (req, res) => {
  try {
    const { username, password } = req.body;
    const seller = await Seller.findOne({ username });
    if (!seller)
      return res.status(404).json({ message: "Seller not found." });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password." });

    const token = createToken({ username, role: "seller" });

    res.json({
      success: true,
      message: "✅ Seller login successful",
      token,
      seller: {
        id: seller._id,
        username: seller.username,
        category: seller.category,
        pincode: seller.pincode
      }
    });
  } catch (err) {
    console.error("Seller Login Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ----------------------------------
// 👥 CUSTOMER REGISTER & LOGIN
// ----------------------------------
exports.customerRegister = async (req, res) => {
  try {
    const { username, password, phone } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "All fields required." });

    const exists = await Customer.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "Customer already exists." });

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
    const customer = await Customer.findOne({ username });
    if (!customer)
      return res.status(404).json({ message: "Customer not found." });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password." });

    const token = createToken({ username, role: "customer" });

    res.json({
      success: true,
      message: "✅ Customer login successful",
      token,
      customer: {
        id: customer._id,
        username: customer.username,
        phone: customer.phone
      }
    });
  } catch (err) {
    console.error("Customer Login Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ----------------------------------
// 🚚 DELIVERY BOY REGISTER & LOGIN
// ----------------------------------
exports.deliveryBoyRegister = async (req, res) => {
  try {
    const { username, password, area } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "All fields required." });

    const exists = await DeliveryBoy.findOne({ username });
    if (exists)
      return res.status(400).json({ message: "Delivery boy already exists." });

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
    const boy = await DeliveryBoy.findOne({ username });
    if (!boy)
      return res.status(404).json({ message: "Delivery boy not found." });

    const isMatch = await bcrypt.compare(password, boy.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password." });

    const token = createToken({ username, role: "delivery" });

    res.json({
      success: true,
      message: "✅ Delivery boy login successful",
      token,
      deliveryBoy: {
        id: boy._id,
        username: boy.username,
        area: boy.area
      }
    });
  } catch (err) {
    console.error("DeliveryBoy Login Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};
