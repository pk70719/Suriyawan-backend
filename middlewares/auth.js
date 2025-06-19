// middlewares/auth.js

const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");
const Customer = require("../models/Customer");
const DeliveryBoy = require("../models/DeliveryBoy");
const Owner = require("../models/Owner");

const JWT_SECRET = process.env.JWT_SECRET || "suriyawan1Super2SecretKey77";

// 🔐 Universal Token Extractor
const getToken = (req) => req.headers.authorization?.split(" ")[1];

// ✅ Seller Auth
const verifySeller = async (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ success: false, message: "❌ No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const seller = await Seller.findById(decoded.id);
    if (!seller) return res.status(404).json({ success: false, message: "❌ Seller not found" });

    req.user = { id: seller._id, role: "seller" };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "❌ Invalid token", error: err.message });
  }
};

// ✅ Customer Auth
const verifyCustomer = async (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ success: false, message: "❌ No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const customer = await Customer.findById(decoded.id);
    if (!customer) return res.status(404).json({ success: false, message: "❌ Customer not found" });

    req.user = { id: customer._id, role: "customer" };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "❌ Invalid token", error: err.message });
  }
};

// ✅ Delivery Boy Auth
const verifyDeliveryBoy = async (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ success: false, message: "❌ No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const deliveryBoy = await DeliveryBoy.findById(decoded.id);
    if (!deliveryBoy) return res.status(404).json({ success: false, message: "❌ Delivery Boy not found" });

    req.user = { id: deliveryBoy._id, role: "delivery" };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "❌ Invalid token", error: err.message });
  }
};

// ✅ Owner Auth (verified by role only)
const verifyOwner = async (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ success: false, message: "❌ No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "owner" && decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "⛔ Not authorized as Owner" });
    }

    const owner = await Owner.findOne({ email: decoded.username });
    if (!owner) return res.status(404).json({ success: false, message: "❌ Owner not found" });

    req.user = { id: owner._id, role: "owner" };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "❌ Invalid token", error: err.message });
  }
};

module.exports = {
  verifySeller,
  verifyCustomer,
  verifyDeliveryBoy,
  verifyOwner,
};
