// controllers/deliveryController.js

const jwt = require("jsonwebtoken");
const DeliveryBoy = require("../models/DeliveryBoy"); // Required for DB lookups
const JWT_SECRET = process.env.JWT_SECRET || "suriyawan1Super2SecretKey77";

// ✅ Register a new Delivery Boy
exports.register = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ success: false, message: "❌ Name and mobile are required" });
    }

    // Check if already exists
    let existing = await DeliveryBoy.findOne({ mobile });
    if (existing) {
      return res.status(409).json({ success: false, message: "⚠️ Delivery Boy already registered" });
    }

    const newBoy = await DeliveryBoy.create({ name, mobile });

    res.json({ success: true, message: "✅ Registered successfully", deliveryBoy: newBoy });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Server error", error: err.message });
  }
};

// ✅ Login and generate token
exports.login = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ success: false, message: "❌ Mobile number required" });
    }

    const deliveryBoy = await DeliveryBoy.findOne({ mobile });
    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: "❌ Delivery Boy not found" });
    }

    const token = jwt.sign(
      { id: deliveryBoy._id, role: "deliveryBoy" },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ success: true, message: "✅ Login successful", token });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Server error", error: err.message });
  }
};

// ✅ Sample parcel assignment (can be connected to DB later)
exports.assignments = (req, res) => {
  const assignments = [
    { id: "P101", address: "Suriyawan, Road #1", status: "Pending" },
    { id: "P102", address: "Ramganj, Lane 3", status: "Out for Delivery" },
    { id: "P103", address: "Bhadohi, Sector 2", status: "Pending" }
  ];

  res.json({ success: true, assignments });
};

// ✅ Update delivery status
exports.updateStatus = (req, res) => {
  const { parcelId, status } = req.body;

  if (!parcelId || !status) {
    return res.status(400).json({ success: false, message: "❌ Parcel ID and status required" });
  }

  // Later, update in DB here
  res.json({ success: true, message: `📦 Parcel ${parcelId} status updated to '${status}'` });
};

// ✅ Record cash collection
exports.updateCash = (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: "❌ Cash amount is required" });
  }

  // DB update can be added here
  res.json({ success: true, message: `💰 Cash of ₹${amount} updated successfully` });
};

// ✅ Track delivery boy location
exports.updateLocation = (req, res) => {
  const { lat, long } = req.body;

  if (!lat || !long) {
    return res.status(400).json({ success: false, message: "❌ Latitude and longitude required" });
  }

  // Future: Save to DB
  res.json({ success: true, message: "📍 Location updated", location: { lat, long } });
};
