const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true
    },

    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      default: null
    },

    product: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    quantity: {
      type: Number,
      default: 1
    },

    address: {
      type: String,
      required: true
    },

    pincode: {
      type: String,
      required: true
    },

    trackingId: {
      type: String,
      unique: true,
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"],
      default: "Pending"
    },

    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid", "COD"],
      default: "COD"
    },

    isDelivered: {
      type: Boolean,
      default: false
    },

    deliveredAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
