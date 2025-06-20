const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// 🔐 Upload Product Image to Cloudinary & Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const sellerId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "❌ Product image is required" });
    }

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "seller_products",
    });

    fs.unlinkSync(req.file.path); // Delete temp file

    const product = await Product.create({
      seller: sellerId,
      name,
      price,
      description,
      imageUrl: upload.secure_url,
      available: true,
    });

    res.status(201).json({ success: true, message: "✅ Product created", product });
  } catch (err) {
    console.error("❌ Create Product Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while creating product" });
  }
};

// 📦 Get All Products of Logged-in Seller
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// ✏️ Update Product Details (Name, Price, Description)
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const productId = req.params.id;

    const updated = await Product.findOneAndUpdate(
      { _id: productId, seller: req.user.id },
      { name, price, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "❌ Product not found or unauthorized" });
    }

    res.json({ success: true, message: "✅ Product updated", product: updated });
  } catch (err) {
    console.error("❌ Update Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while updating product" });
  }
};

// 🗑️ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deleted = await Product.findOneAndDelete({
      _id: productId,
      seller: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "❌ Product not found or unauthorized" });
    }

    res.json({ success: true, message: "✅ Product deleted" });
  } catch (err) {
    console.error("❌ Delete Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while deleting product" });
  }
};

// 🚦 Toggle Product Availability (On/Off)
exports.toggleAvailability = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findOne({ _id: productId, seller: req.user.id });
    if (!product) {
      return res.status(404).json({ success: false, message: "❌ Product not found" });
    }

    product.available = !product.available;
    await product.save();

    res.json({
      success: true,
      message: `✅ Product marked as ${product.available ? "Available" : "Unavailable"}`,
    });
  } catch (err) {
    console.error("❌ Toggle Availability Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while toggling availability" });
  }
};

// 🚚 Assign Product to Delivery Boy
exports.assignProductToDelivery = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deliveryBoyId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "❌ Product not found" });

    product.assignedTo = deliveryBoyId;
    await product.save();

    res.json({ success: true, message: "✅ Product assigned to delivery boy" });
  } catch (err) {
    console.error("❌ Assign Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while assigning product" });
  }
};

// 🚚 Get Products Assigned to Delivery Boy
exports.getDeliveryProducts = async (req, res) => {
  try {
    const products = await Product.find({ assignedTo: req.user.id });
    res.json({ success: true, products });
  } catch (err) {
    console.error("❌ Fetch Delivery Products Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while fetching delivery products" });
  }
};

// 🛒 Get All Active Products for Customers
exports.getAllProductsForCustomer = async (req, res) => {
  try {
    const products = await Product.find({ available: true }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error("❌ Fetch Customer Products Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while fetching products" });
  }
};
