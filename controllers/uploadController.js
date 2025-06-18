const path = require("path");
const Seller = require("../models/Seller");
const Customer = require("../models/Customer");
const DeliveryBoy = require("../models/DeliveryBoy");
const Owner = require("../models/Owner"); // Add Owner model

exports.uploadUserImage = async (req, res) => {
  const role = req.params.role.toLowerCase();  // seller / customer / delivery / owner
  const id = req.params.id;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
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
      return res.status(400).json({ success: false, message: "Invalid role" });
  }

  try {
    const user = await model.findByIdAndUpdate(id, { imageUrl }, { new: true }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: `${role} not found` });
    }

    res.json({
      success: true,
      message: `${role} image uploaded successfully`,
      userId: id,
      role,
      imageUrl: user.imageUrl
    });
  } catch (err) {
    console.error("Upload Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
