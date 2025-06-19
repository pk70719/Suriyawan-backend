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
      required: [true, "🧾 Product name is required"]
    },

    price: {
      type: Number,
      required: [true, "💰 Product price is required"],
      min: [0, "Price must be positive"]
    },

    quantity: {
      type: Number,
      default: 1,
      min: [1, "Minimum quantity is 1"]
    },

    address: {
      type: String,
      required: [true, "📦 Delivery address is required"]
    },

    pincode: {
      type: String,
      required: [true, "📍 Pincode is required"]
    },

    trackingId: {
      type: String,
      required: [true, "📌 Tracking ID is required"],
      unique: true,
      trim: true
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
  {
    timestamps: true
  }
);

// ✅ Index for faster search on tracking ID
orderSchema.index({ trackingId: 1 });

module.exports = mongoose.model("Order", orderSchema);
