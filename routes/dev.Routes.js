const express = require("express");
const router = express.Router();
const Owner = require("../models/ownerModel");
const bcrypt = require("bcryptjs");

router.get("/create-owner", async (req, res) => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const owner = new Owner({
    username: "pradeepseth646",
    password: gss626hPgeehghx56,
    name: "pradeep seth"
  });

  await owner.save();
  res.json({ success: true, message: "Owner created ✅" });
});

module.exports = router;
