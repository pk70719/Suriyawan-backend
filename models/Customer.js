const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    mobile: {
      type: String,
      required: true,
      unique: true
    },

    address: {
      type: String,
      default: ""
    },

    pincode: {
      type: String,
      default: ""
    },

    imageUrl: {
      type: String,
      default: "" // Profile image
    }
  },
  {
    timestamps: true // ✅ Yeh yahan hona chahiye
  }
);

module.exports = mongoose.model("Customer", customerSchema);
