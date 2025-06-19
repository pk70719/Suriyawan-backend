const jwt = require("jsonwebtoken");
const Owner = require("../models/owner");

// 📌 ENV Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "suriyawan1Super2SecretKey77";

// ✅ Owner Login (without password)
exports.loginOwner = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: "📛 Username required" });
  }

  try {
    const owner = await Owner.findOne({ email: username.toLowerCase() });
    if (!owner) {
      return res.status(404).json({ success: false, message: "❌ Owner not found" });
    }

    const token = jwt.sign(
      { role: owner.role, username: owner.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message: "✅ Login successful!",
      token,
      owner
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "❌ Server error" });
  }
};

// ✅ Set or Update Owner Password
exports.setPassword = async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({ success: false, message: "Username & new password required" });
  }

  try {
    const owner = await Owner.findOne({ email: username.toLowerCase() });
    if (!owner) {
      return res.status(404).json({ success: false, message: "❌ Owner not found" });
    }

    owner.password = newPassword;
    await owner.save();

    return res.json({ success: true, message: "✅ Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "❌ Failed to update password" });
  }
};

// ✅ Owner Dashboard Stats (sample data)
exports.getOwnerStats = async (req, res) => {
  try {
    // Replace with actual DB logic later
    res.json({
      success: true,
      orders: 123,
      revenue: 12000,
      deliveryBoys: 6,
      sellers: 8,
      customers: 20
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Failed to load stats" });
  }
};
