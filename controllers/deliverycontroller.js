const DeliveryBoy = require("../models/DeliveryBoy");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Register Delivery Boy
exports.register = async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    if (!name || !phone || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existing = await DeliveryBoy.findOne({ phone });
    if (existing)
      return res.status(409).json({ success: false, message: "Delivery boy already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await DeliveryBoy.create({ name, phone, password: hashed, cashCollected: 0 });

    res.status(201).json({ success: true, message: "Registered successfully", user });
  } catch (err) {
    res.status(400).json({ success: false, message: "Registration failed", error: err.message });
  }
};

// ✅ Login Delivery Boy
exports.login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await DeliveryBoy.findOne({ phone });
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, role: "delivery" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user._id, name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Assigned Parcels
exports.assignments = async (req, res) => {
  try {
    const user = await DeliveryBoy.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "Delivery boy not found" });

    // Placeholder logic for assigned parcels
    res.json({ success: true, assignedParcels: user.assignedParcels || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching assignments" });
  }
};

// ✅ Update Parcel Status
exports.updateStatus = async (req, res) => {
  const { status, parcelId } = req.body;
  try {
    if (!parcelId || !status)
      return res.status(400).json({ success: false, message: "Parcel ID and status are required" });

    const user = await DeliveryBoy.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Parcel update logic to be handled
    res.json({ success: true, message: `Parcel ${parcelId} marked as ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update parcel status" });
  }
};

// ✅ Update Collected Cash
exports.updateCash = async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await DeliveryBoy.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.cashCollected = (user.cashCollected || 0) + parseFloat(amount);
    await user.save();

    res.json({ success: true, totalCash: user.cashCollected });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update cash" });
  }
};

// ✅ Update Location (GPS)
exports.updateLocation = async (req, res) => {
  const { lat, lng } = req.body;
  try {
    if (!lat || !lng) return res.status(400).json({ success: false, message: "Latitude and longitude required" });

    const user = await DeliveryBoy.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.location = { lat, lng };
    await user.save();

    res.json({ success: true, location: user.location });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update location" });
  }
};
