const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Owner = require("../models/Owner");

const JWT_SECRET = process.env.JWT_SECRET || "suriyawan1Super2SecretKey77";

// 🔐 Utility: Token Generator
function generateToken(owner) {
  return jwt.sign(
    { id: owner._id, role: "owner", username: owner.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// ✅ OWNER LOGIN (with password auth)
exports.loginOwner = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ success: false, message: "📛 Username & password required" });

  try {
    const owner = await Owner.findOne({ email: username.toLowerCase() });
    if (!owner)
      return res.status(404).json({ success: false, message: "❌ Owner not found" });

    const isMatch = await bcrypt.compare(password, owner.password || "");
    if (!isMatch)
      return res.status(401).json({ success: false, message: "❌ Incorrect password" });

    const token = generateToken(owner);
    return res.json({
      success: true,
      message: "✅ लॉगिन सफल!",
      token,
      owner: {
        id: owner._id,
        username: owner.email,
        role: owner.role
      }
    });
  } catch (err) {
    console.error("Owner Login Error:", err.message);
    return res.status(500).json({ success: false, message: "❌ Server error" });
  }
};

// ✅ SET/UPDATE Owner Password
exports.setPassword = async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword)
    return res.status(400).json({ success: false, message: "📛 Username & new password required" });

  try {
    const owner = await Owner.findOne({ email: username.toLowerCase() });
    if (!owner)
      return res.status(404).json({ success: false, message: "❌ Owner not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    owner.password = hashedPassword;
    await owner.save();

    return res.json({ success: true, message: "🔐 Password updated successfully" });
  } catch (err) {
    console.error("Set Password Error:", err.message);
    return res.status(500).json({ success: false, message: "❌ Failed to update password" });
  }
};

// ✅ OWNER DASHBOARD STATS (Real-time future-ready)
exports.getOwnerStats = async (req, res) => {
  try {
    // Future: You can fetch real stats from DB here
    res.json({
      success: true,
      stats: {
        totalOrders: 123,
        totalRevenue: 12000,
        deliveryBoys: 6,
        sellers: 8,
        customers: 20
      }
    });
  } catch (err) {
    console.error("Stats Error:", err.message);
    res.status(500).json({ success: false, message: "❌ Failed to load stats" });
  }
};
