const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Owner = require("../models/owner");

// ✅ Simplified Login (Only with Email / Username)
router.post("/login", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ success: false, message: "Username is required" });

  const owner = await Owner.findOne({ email: username.toLowerCase() });
  if (!owner) return res.status(401).json({ success: false, message: "❌ Owner not found" });

  const token = jwt.sign(
    { role: owner.role, username: owner.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    success: true,
    message: "✅ लॉगिन सफल!",
    token,
    owner
  });
});

// ✅ Set or Update Password (Owner Only)
router.post("/set-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: "Email and new password required" });
  }

  const owner = await Owner.findOne({ email: email.toLowerCase() });
  if (!owner) return res.status(404).json({ success: false, message: "Owner not found" });

  owner.password = newPassword;
  await owner.save();

  res.json({ success: true, message: "✅ Password updated successfully" });
});

module.exports = router;
