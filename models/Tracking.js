const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: [true, "Tracking ID is required"],
      unique: true,
      trim: true
    },

    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0
    },

    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true
    },

    address: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v); // ✅ Valid Indian mobile format
        },
        message: "Invalid mobile number"
      }
    }
  },
  {
    timestamps: true // ✅ createdAt & updatedAt enabled
  }
);

module.exports = mongoose.model("Tracking", trackingSchema);
