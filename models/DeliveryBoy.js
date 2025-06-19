const mongoose = require("mongoose");

const deliveryBoySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "👤 Name is required"],
      trim: true,
      minlength: [2, "Name should be at least 2 characters"]
    },

    phone: {
      type: String,
      required: [true, "📱 Phone number is required"],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number"]
    },

    password: {
      type: String,
      required: [true, "🔒 Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },

    assignedParcels: {
      type: [String], // 🧾 Array of tracking IDs
      default: []
    },

    cashCollected: {
      type: Number,
      default: 0,
      min: 0
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
      default: "" // 🖼️ Profile image
    }
  },
  {
    timestamps: true // ⏱️ createdAt & updatedAt enabled
  }
);

// ✅ Index for faster lookups
deliveryBoySchema.index({ phone: 1 });

module.exports = mongoose.model("DeliveryBoy", deliveryBoySchema);
