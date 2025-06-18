const express = require("express");
const router = express.Router();
const Owner = require("../models/ownerModel");
const bcrypt = require("bcryptjs");

router.get("/create-owner", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("gss626hPgeehghx56", 10);

    const owner = new Owner({
      username: "Pradeepseth646",
      password: hashedPassword,
      name: "pradeep seth"
    });

    await owner.save();
    res.json({ success: true, message: "✅ Owner created successfully" });

  } catch (error) {
    console.error("❌ Error creating owner:", error);
    res.status(500).json({ success: false, message: "❌ Server error" });
  }
});

module.exports = router;
