const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: [true, "Password is required"]
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
      default: "" // Profile image path
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
      validate: {
        validator: function (v) {
          return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: "Invalid email format"
      }
    },

    mobile: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v); // Valid Indian mobile number
        },
        message: "Invalid mobile number"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Seller", sellerSchema);
