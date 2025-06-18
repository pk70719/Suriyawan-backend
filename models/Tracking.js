const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
  trackingId: String,
  productName: String,
  price: String,
  customerName: String,
  address: String,
  mobile: String,
}, { timestamps: true });

module.exports = mongoose.model("Tracking", trackingSchema);
