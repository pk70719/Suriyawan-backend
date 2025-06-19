const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "📧 Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "📬 Invalid email format"
      ]
    },

    password: {
      type: String,
      required: [true, "🔐 Password is required"],
      minlength: [6, "🔑 Password must be at least 6 characters"]
    },

    name: {
      type: String,
      default: "Admin",
      trim: true
    },

    role: {
      type: String,
      default: "owner",
      enum: ["owner"]
    },

    imageUrl: {
      type: String,
      default: "" // Profile image URL
    },

    mobile: {
      type: String,
      default: "",
      match: [/^[0-9]{10}$/, "📱 Mobile number must be 10 digits"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Owner", ownerSchema);
