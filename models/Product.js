const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: [true, "Seller reference is required"]
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"]
    },

    description: {
      type: String,
      default: "No description provided"
    },

    category: {
      type: String,
      default: "General"
    },

    stock: {
      type: Number,
      default: 100,
      min: [0, "Stock cannot be negative"]
    },

    image: {
      type: String,
      default: "" // Image URL
    },

    isActive: {
      type: Boolean,
      default: true
    },

    orders: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer"
        },
        customerName: {
          type: String,
          default: ""
        },
        address: {
          type: String,
          default: ""
        },
        phone: {
          type: String,
          default: ""
        },
        quantity: {
          type: Number,
          default: 1
        },
        status: {
          type: String,
          enum: ["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
          default: "Pending"
        },
        trackingId: {
          type: String,
          default: ""
        },
        orderedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);
