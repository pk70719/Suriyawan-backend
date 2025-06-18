// controllers/deliveryController.js

exports.register = (req, res) => {
  const { name, mobile } = req.body;
  if (!name || !mobile) {
    return res.status(400).json({ success: false, message: "❌ Name and mobile are required" });
  }
  res.json({ success: true, message: "✅ Registered successfully", deliveryBoy: { name, mobile } });
};

exports.login = (req, res) => {
  const { mobile } = req.body;
  if (!mobile) {
    return res.status(400).json({ success: false, message: "❌ Mobile number required" });
  }

  const jwt = require("jsonwebtoken");
  const token = jwt.sign({ role: "deliveryBoy", mobile }, process.env.JWT_SECRET || "defaultsecret", {
    expiresIn: "2h",
  });

  res.json({ success: true, message: "✅ Login successful", token });
};

exports.assignments = (req, res) => {
  res.json({ success: true, assignments: ["Parcel #101", "Parcel #102", "Parcel #103"] });
};

exports.updateStatus = (req, res) => {
  const { parcelId, status } = req.body;
  if (!parcelId || !status) {
    return res.status(400).json({ success: false, message: "❌ Parcel ID and status required" });
  }
  res.json({ success: true, message: `📦 Parcel ${parcelId} status updated to ${status}` });
};

exports.updateCash = (req, res) => {
  const { amount } = req.body;
  res.json({ success: true, message: `💰 Cash of ₹${amount} updated successfully` });
};

exports.updateLocation = (req, res) => {
  const { lat, long } = req.body;
  res.json({ success: true, message: "📍 Location updated", location: { lat, long } });
};
