const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "👤 Name is required"],
      trim: true,
      minlength: [2, "Name should be at least 2 characters"]
    },

    email: {
      type: String,
      required: [true, "📧 Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },

    password: {
      type: String,
      required: [true, "🔒 Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },

    mobile: {
      type: String,
      required: [true, "📱 Mobile number is required"],
      unique: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number"]
    },

    address: {
      type: String,
      default: "",
      trim: true
    },

    pincode: {
      type: String,
      default: "",
      match: [/^\d{6}$/, "Invalid PIN code"]
    },

    imageUrl: {
      type: String,
      default: "" // Will hold image path or URL
    }
  },
  {
    timestamps: true // ✅ Adds createdAt & updatedAt automatically
  }
);

// Optional: Add index for performance
customerSchema.index({ email: 1 });
customerSchema.index({ mobile: 1 });

module.exports = mongoose.model("Customer", customerSchema);
