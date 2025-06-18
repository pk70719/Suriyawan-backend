const Owner = require("../models/Owner");
const Seller = require("../models/Seller");
const Customer = require("../models/Customer");
const DeliveryBoy = require("../models/DeliveryBoy");
const bcrypt = require("bcryptjs");

// ✅ GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userType = req.user.role;
    const userId = req.user.id;

    let user = null;

    if (userType === "owner") {
      user = await Owner.findById(userId).select("-password");
    } else if (userType === "seller") {
      user = await Seller.findById(userId).select("-password");
    } else if (userType === "customer") {
      user = await Customer.findById(userId).select("-password");
    } else if (userType === "delivery") {
      user = await DeliveryBoy.findById(userId).select("-password");
    }

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ✅ UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userType = req.user.role;
    const userId = req.user.id;
    const { category, pincode, password, name, phone, address } = req.body;

    let model = null;
    const updates = {};

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Common updates
    if (category) updates.category = category;
    if (pincode) updates.pincode = pincode;
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;

    // Model assignment based on role
    if (userType === "owner") model = Owner;
    else if (userType === "seller") model = Seller;
    else if (userType === "customer") model = Customer;
    else if (userType === "delivery") model = DeliveryBoy;

    if (!model) return res.status(400).json({ success: false, message: "Invalid user role." });

    const updatedUser = await model.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found." });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
