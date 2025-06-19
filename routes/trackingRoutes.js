const express = require("express");
const router = express.Router();
const Tracking = require("../models/Tracking");
const auth = require("../middlewares/ownerAuth"); // ✅ Fixed path here

// 📌 Save new tracking ID
router.post("/create", auth, async (req, res) => {
  try {
    const { productName, price, customerName, address, mobile } = req.body;
    const trackingId = Math.floor(10000000 + Math.random() * 90000000).toString();

    const saved = await Tracking.create({
      trackingId,
      productName,
      price,
      customerName,
      address,
      mobile
    });

    res.json({ success: true, trackingId, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating tracking ID" });
  }
});

// 📌 Fetch all or search by tracking ID
router.get("/all", auth, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search ? { trackingId: search } : {};
    const data = await Tracking.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching records" });
  }
});

module.exports = router;
