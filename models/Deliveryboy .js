const mongoose = require("mongoose");

const deliveryBoySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    assignedParcels: {
      type: [String], // Array of tracking IDs
      default: []
    },

    cashCollected: {
      type: Number,
      default: 0
    },

    location: {
      lat: {
        type: Number,
        default: 0
      },
      lng: {
        type: Number,
        default: 0
      }
    },

    status: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Available"
    },

    imageUrl: {
      type: String,
      default: "" // For profile photo if needed
    }
  },
  {
    timestamps: true // ✅ Important for tracking when delivery boy joined/updated
  }
);

module.exports = mongoose.model("DeliveryBoy", deliveryBoySchema);
