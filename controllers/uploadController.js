const path = require("path");
const fs = require("fs");
const Seller = require("../models/Seller");
const Customer = require("../models/Customer");
const DeliveryBoy = require("../models/DeliveryBoy");
const Owner = require("../models/Owner");

// ✅ Upload Profile Image for Any User Type
exports.uploadUserImage = async (req, res) => {
  const role = req.params.role.toLowerCase(); // seller / customer / delivery / owner
  const id = req.params.id;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "❌ No file uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  let model;

  switch (role) {
    case "seller":
      model = Seller;
      break;
    case "customer":
      model = Customer;
      break;
    case "delivery":
      model = DeliveryBoy;
      break;
    case "owner":
      model = Owner;
      break;
    default:
      return res.status(400).json({ success: false, message: "❌ Invalid user role" });
  }

  try {
    const updated = await model.findByIdAndUpdate(
      id,
      { imageUrl },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      // Remove uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: `❌ ${role} not found` });
    }

    res.status(200).json({
      success: true,
      message: `✅ ${role} image uploaded successfully`,
      role,
      userId: id,
      imageUrl: updated.imageUrl
    });
  } catch (err) {
    console.error("Upload Error:", err.message);
    fs.unlinkSync(req.file.path); // Clean up if error occurs
    res.status(500).json({ success: false, message: "❌ Server error during image upload" });
  }
};
