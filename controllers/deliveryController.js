const jwt = require("jsonwebtoken");
const DeliveryBoy = require("../models/DeliveryBoy");

const JWT_SECRET = process.env.JWT_SECRET || "suriyawan1Super2SecretKey77";

// 🔐 Utility
const generateToken = (deliveryBoy) => {
  return jwt.sign(
    { id: deliveryBoy._id, role: "delivery" },
    JWT_SECRET,
    { expiresIn: "3h" }
  );
};

// ✅ REGISTER Delivery Boy
exports.register = async (req, res) => {
  try {
    const { name, mobile, area } = req.body;
    if (!name || !mobile || !area) {
      return res.status(400).json({ success: false, message: "📛 Name, 📱 mobile & 📍 area required" });
    }

    const exists = await DeliveryBoy.findOne({ mobile });
    if (exists)
      return res.status(409).json({ success: false, message: "⚠️ Already registered" });

    const newBoy = await DeliveryBoy.create({ name, mobile, area });
    res.status(201).json({
      success: true,
      message: "✅ Delivery boy registered",
      deliveryBoy: newBoy
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ success: false, message: "❌ Server error" });
  }
};

// ✅ LOGIN Delivery Boy
exports.login = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile)
      return res.status(400).json({ success: false, message: "📱 Mobile required" });

    const deliveryBoy = await DeliveryBoy.findOne({ mobile });
    if (!deliveryBoy)
      return res.status(404).json({ success: false, message: "🚫 Not found" });

    const token = generateToken(deliveryBoy);
    res.json({
      success: true,
      message: "✅ लॉगिन सफल!",
      token,
      deliveryBoy: {
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        mobile: deliveryBoy.mobile,
        area: deliveryBoy.area,
      }
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: "❌ Server error" });
  }
};

// ✅ GET Sample Assignments
exports.assignments = async (req, res) => {
  try {
    const assignments = [
      { id: "P101", address: "Suriyawan, Road #1", status: "Pending" },
      { id: "P102", address: "Ramganj, Lane 3", status: "Out for Delivery" },
      { id: "P103", address: "Bhadohi, Sector 2", status: "Delivered" }
    ];
    res.json({ success: true, assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Can't fetch assignments" });
  }
};

// ✅ UPDATE Delivery Status
exports.updateStatus = async (req, res) => {
  try {
    const { parcelId, status } = req.body;
    if (!parcelId || !status)
      return res.status(400).json({ success: false, message: "📦 Parcel ID & status required" });

    // Future: Update database
    res.json({ success: true, message: `📝 Parcel ${parcelId} marked '${status}'` });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Failed to update status" });
  }
};

// ✅ UPDATE Cash Collection
exports.updateCash = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount)
      return res.status(400).json({ success: false, message: "💸 Amount required" });

    // Future: Save to DB
    res.json({ success: true, message: `💰 ₹${amount} collected & updated.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Cash update failed" });
  }
};

// ✅ UPDATE GPS Location
exports.updateLocation = async (req, res) => {
  try {
    const { lat, long } = req.body;
    if (!lat || !long)
      return res.status(400).json({ success: false, message: "📍 Latitude & longitude required" });

    // Future: Save to DB or Firebase
    res.json({ success: true, message: "📡 Location received", location: { lat, long } });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Location update failed" });
  }
};
