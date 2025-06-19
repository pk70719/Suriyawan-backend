const express = require("express");
const router = express.Router();
const Tracking = require("../models/Tracking");
const auth = require("../middlewares/ownerAuth"); // 🔒 Only Owner can access

// 🔐 Middleware: Only owner allowed
// 📦 Route: Create New Tracking ID
router.post("/create", auth, async (req, res) => {
  try {
    const { productName, price, customerName, address, mobile } = req.body;

    if (!productName || !price || !customerName || !address || !mobile) {
      return res.status(400).json({ success: false, message: "❌ Missing required fields" });
    }

    const trackingId = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8-digit ID

    const saved = await Tracking.create({
      trackingId,
      productName,
      price,
      customerName,
      address,
      mobile,
    });

    res.json({ success: true, message: "✅ Tracking ID created", trackingId, data: saved });
  } catch (err) {
    console.error("Tracking Create Error:", err);
    res.status(500).json({ success: false, message: "❌ Error creating tracking ID" });
  }
});

// 📦 Route: Get All Tracking Entries (optional search)
router.get("/all", auth, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? {
          $or: [
            { trackingId: { $regex: search, $options: "i" } },
            { productName: { $regex: search, $options: "i" } },
            { customerName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const data = await Tracking.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error("Tracking Fetch Error:", err);
    res.status(500).json({ success: false, message: "❌ Error fetching tracking records" });
  }
});

// 🚀 Future: Add "delete" and "update" tracking if needed

module.exports = router;
