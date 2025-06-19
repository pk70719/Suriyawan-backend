const Seller = require("../models/Seller");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");

// 📄 Get Seller Profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select("-password");
    if (!seller) {
      return res.status(404).json({ success: false, message: "❌ Seller not found" });
    }

    res.status(200).json({ success: true, seller });
  } catch (err) {
    console.error("Get Seller Profile Error:", err.message);
    res.status(500).json({ success: false, message: "❌ Server error while fetching profile" });
  }
};

// ✏️ Update Seller Profile (with password hashing if provided)
exports.updateSellerProfile = async (req, res) => {
  try {
    const { name, phone, address, category, pincode, password } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (category) updates.category = category;
    if (pincode) updates.pincode = pincode;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedSeller = await Seller.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedSeller) {
      return res.status(404).json({ success: false, message: "❌ Seller not found" });
    }

    res.status(200).json({ success: true, message: "✅ Profile updated", seller: updatedSeller });
  } catch (err) {
    console.error("Update Seller Error:", err.message);
    res.status(500).json({ success: false, message: "❌ Server error while updating profile" });
  }
};

// 🗑️ Delete Seller Account
exports.deleteSeller = async (req, res) => {
  try {
    const deleted = await Seller.findByIdAndDelete(req.user.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "❌ Seller not found for deletion" });
    }

    res.status(200).json({ success: true, message: "✅ Seller account deleted successfully" });
  } catch (err) {
    console.error("Delete Seller Error:", err.message);
    res.status(500).json({ success: false, message: "❌ Server error while deleting seller" });
  }
};

// 📦 Get All Products Belonging to Seller
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Get Seller Products Error:", err.message);
    res.status(500).json({ success: false, message: "❌ Server error while fetching products" });
  }
};
