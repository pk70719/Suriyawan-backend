const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// 📤 Add New Product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const sellerId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Product image is required" });
    }

    // Cloudinary Upload
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "seller_products",
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    const newProduct = new Product({
      seller: sellerId,
      name,
      price,
      description,
      imageUrl: upload.secure_url,
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error("Create Product Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while creating product" });
  }
};

// 📄 Get Seller's Products
exports.getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Get Products Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while fetching products" });
  }
};

// ✏️ Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const { id: productId } = req.params;
    const sellerId = req.user.id;

    const updated = await Product.findOneAndUpdate(
      { _id: productId, seller: sellerId },
      { name, price, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: updated });
  } catch (err) {
    console.error("Update Product Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while updating product" });
  }
};

// 🗑️ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const sellerId = req.user.id;

    const deleted = await Product.findOneAndDelete({ _id: productId, seller: sellerId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete Product Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while deleting product" });
  }
};

// 🚦 Toggle Product Availability
exports.toggleAvailability = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const sellerId = req.user.id;

    const product = await Product.findOne({ _id: productId, seller: sellerId });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.available = !product.available;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product marked as ${product.available ? "Available" : "Unavailable"}`,
    });
  } catch (err) {
    console.error("Toggle Availability Error:", err.message);
    res.status(500).json({ success: false, message: "Server error while toggling availability" });
  }
};
