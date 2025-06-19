const jwt = require("jsonwebtoken");
const DeliveryBoy = require("../models/DeliveryBoy");

const JWT_SECRET = process.env.JWT_SECRET || "suriyawan1Super2SecretKey77";

// 🔐 Token Generator
const generateToken = (deliveryBoy) => {
  return jwt.sign(
    { id: deliveryBoy._id, role: "delivery" },
    JWT_SECRET,
    { expiresIn: "3h" }
  );
};

// ✅ Register
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

// ✅ Login
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

// ✅ Assignments (sample data)
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

// ✅ Update Status
exports.updateStatus = async (req, res) => {
  try {
    const { parcelId, status } = req.body;
    if (!parcelId || !status)
      return res.status(400).json({ success: false, message: "📦 Parcel ID & status required" });

    res.json({ success: true, message: `📝 Parcel ${parcelId} marked '${status}'` });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Failed to update status" });
  }
};

// ✅ Update Cash
exports.updateCash = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount)
      return res.status(400).json({ success: false, message: "💸 Amount required" });

    res.json({ success: true, message: `💰 ₹${amount} collected & updated.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Cash update failed" });
  }
};

// ✅ Update Location
exports.updateLocation = async (req, res) => {
  try {
    const { lat, long } = req.body;
    if (!lat || !long)
      return res.status(400).json({ success: false, message: "📍 Latitude & longitude required" });

    res.json({ success: true, message: "📡 Location received", location: { lat, long } });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Location update failed" });
  }
};

// ✅ Profile
exports.profile = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.user.id);
    if (!deliveryBoy)
      return res.status(404).json({ success: false, message: "🧍 Delivery profile not found" });

    res.json({
      success: true,
      deliveryBoy: {
        name: deliveryBoy.name,
        mobile: deliveryBoy.mobile,
        area: deliveryBoy.area
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Failed to fetch profile" });
  }
};

// ✅ Logout (optional dummy for now)
exports.logout = async (req, res) => {
  res.json({ success: true, message: "👋 Logged out successfully" });
};
