const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Owner = require("../models/owner");

// ✅ Login route (without password)
router.post("/login", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, message: "Username required" });
  }

  const owner = await Owner.findOne({ email: username.toLowerCase() });
  if (!owner) {
    return res.status(401).json({ success: false, message: "Owner not found" });
  }

  const token = jwt.sign(
    { role: owner.role, username: owner.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    success: true,
    message: "✅ Login successful",
    token,
    owner
  });
});

// ✅ Set/Update password route
router.post("/set-password", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and Password required" });

  const owner = await Owner.findOne({ email: email.toLowerCase() });
  if (!owner) return res.status(404).json({ success: false, message: "Owner not found" });

  owner.password = password;
  await owner.save();

  res.json({ success: true, message: "✅ Password set successfully" });
});

module.exports = router;
