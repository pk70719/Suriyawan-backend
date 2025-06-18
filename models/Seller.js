const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: ""
    },

    pincode: {
      type: String,
      default: ""
    },

    phase: {
      type: String,
      default: "Not Set"
    },

    imageUrl: {
      type: String,
      default: "" // profile image for UI
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: ""
    },

    mobile: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
