const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    default: "Admin"
  },
  role: {
    type: String,
    default: "owner"
  },
  imageUrl: {
    type: String,
    default: ""
  },
  mobile: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Owner", ownerSchema);
