const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');
const Customer = require('../models/Customer');
const DeliveryBoy = require('../models/DeliveryBoy');

const JWT_SECRET = process.env.JWT_SECRET || 'suriyawan1Super2SecretKey77'; // safe fallback

// 🔐 Middleware for Seller
const verifySeller = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Access denied: No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const seller = await Seller.findById(decoded.id);
    if (!seller) return res.status(401).json({ success: false, message: "Seller not found" });

    req.user = seller;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// 🔐 Middleware for Customer
const verifyCustomer = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Access denied: No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const customer = await Customer.findById(decoded.id);
    if (!customer) return res.status(401).json({ success: false, message: "Customer not found" });

    req.user = customer;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// 🔐 Middleware for Delivery Boy
const verifyDeliveryBoy = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Access denied: No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const deliveryBoy = await DeliveryBoy.findById(decoded.id);
    if (!deliveryBoy) return res.status(401).json({ success: false, message: "Delivery Boy not found" });

    req.user = deliveryBoy;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// 🔐 Middleware for Owner
const verifyOwner = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Access denied: No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'owner') {
      return res.status(403).json({ success: false, message: "Not authorized as owner" });
    }

    req.user = { role: 'owner' };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = {
  verifySeller,
  verifyCustomer,
  verifyDeliveryBoy,
  verifyOwner
};
