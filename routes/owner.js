const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner"); // ✅ Correct casing for Linux/Render file systems
const { verifyOwner } = require("../middlewares/auth");

// ✅ POST /owner/login – Login Owner without password
router.post("/login", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, message: "❌ Username is required" });
    }

    const owner = await Owner.findOne({ email: username.toLowerCase() });

    if (!owner) {
      return res.status(404).json({ success: false, message: "❌ Owner not found" });
    }

    // ✅ JWT Token with role and username
    const token = jwt.sign(
      {
        role: "owner",
        username: owner.email,
      },
      process.env.JWT_SECRET || "suriyawan1Super2SecretKey77", // Fallback secret
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      message: "✅ लॉगिन सफल!",
      token,
      owner,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "❌ Server error during login",
      error: err.message,
    });
  }
});

// ✅ GET /owner/profile – Secure route to fetch owner info
router.get("/profile", verifyOwner, async (req, res) => {
  try {
    const owner = await Owner.findOne({ email: req.user.username });
    if (!owner) return res.status(404).json({ success: false, message: "❌ Owner not found" });

    res.json({ success: true, owner });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Server error", error: err.message });
  }
});

module.exports = router;
