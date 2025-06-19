const Owner = require("../models/Owner");
const Seller = require("../models/Seller");
const Customer = require("../models/Customer");
const DeliveryBoy = require("../models/DeliveryBoy");
const bcrypt = require("bcryptjs");

// 🔐 GET PROFILE BASED ON ROLE
exports.getProfile = async (req, res) => {
  try {
    const { role, id } = req.user;
    let user = null;

    switch (role) {
      case "owner":
        user = await Owner.findById(id).select("-password");
        break;
      case "seller":
        user = await Seller.findById(id).select("-password");
        break;
      case "customer":
        user = await Customer.findById(id).select("-password");
        break;
      case "delivery":
      case "deliveryBoy":
        user = await DeliveryBoy.findById(id).select("-password");
        break;
      default:
        return res.status(400).json({ success: false, message: "❌ Invalid role." });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "❌ User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("❌ Get Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while fetching profile." });
  }
};

// ✏️ UPDATE PROFILE BASED ON ROLE
exports.updateProfile = async (req, res) => {
  try {
    const { role, id } = req.user;
    const { category, pincode, password, name, phone, address } = req.body;

    const updates = {};

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    if (category) updates.category = category;
    if (pincode) updates.pincode = pincode;
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;

    let model;

    switch (role) {
      case "owner":
        model = Owner;
        break;
      case "seller":
        model = Seller;
        break;
      case "customer":
        model = Customer;
        break;
      case "delivery":
      case "deliveryBoy":
        model = DeliveryBoy;
        break;
      default:
        return res.status(400).json({ success: false, message: "❌ Invalid user role." });
    }

    const updatedUser = await model.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "❌ User not found for update." });
    }

    res.status(200).json({ success: true, message: "✅ Profile updated", user: updatedUser });
  } catch (err) {
    console.error("❌ Update Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while updating profile." });
  }
};
