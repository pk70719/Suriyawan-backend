const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET = process.env.JWT_SECRET;

// 🔐 Token Utility
function createToken(customer) {
  return jwt.sign({ id: customer._id, role: "customer" }, SECRET, { expiresIn: "7d" });
}

function verifyToken(req) {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.split(" ")[1]);

  if (!token) return null;

  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

// ✅ Customer Login (with bcrypt + JWT)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "📧 Email aur 🔑 password required hai." });

    const user = await Customer.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: "❌ Invalid credentials (email)." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "❌ Invalid credentials (password)." });

    const token = createToken(user);
    res
      .cookie("token", token, { httpOnly: true, sameSite: "Lax", secure: true })
      .json({
        success: true,
        message: "✅ लॉगिन सफल!",
        token,
        customer: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Customer Info
exports.info = async (req, res) => {
  const auth = verifyToken(req);
  if (!auth) return res.status(401).json({ success: false, message: "🔐 Unauthorized" });

  try {
    const user = await Customer.findById(auth.id).select("name email phone");
    if (!user) return res.status(404).json({ success: false, message: "❌ Customer not found" });

    res.json({ success: true, customer: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error while fetching info" });
  }
};

// ✅ Logout
exports.logout = (req, res) => {
  res.clearCookie("token").json({ success: true, message: "👋 Logged out successfully" });
};

// ✅ Get All Products
exports.products = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Product loading failed" });
  }
};

// ✅ Place Order
exports.order = async (req, res) => {
  const auth = verifyToken(req);
  if (!auth) return res.status(401).json({ success: false, message: "🔐 Login required" });

  try {
    const { productId } = req.body;
    if (!productId)
      return res.status(400).json({ success: false, message: "❗ Product ID is required" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "❌ Product not found" });

    const order = await Order.create({
      customerId: auth.id,
      productId,
      status: "Ordered",
      date: new Date(),
    });

    res.json({ success: true, message: "📦 Order placed successfully", orderId: order._id });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Failed to place order" });
  }
};

// ✅ Track Order Status
exports.track = async (req, res) => {
  const auth = verifyToken(req);
  if (!auth) return res.status(401).json({ success: false, message: "🔐 Unauthorized" });

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order || order.customerId.toString() !== auth.id)
      return res.status(403).json({ success: false, message: "🚫 Access denied" });

    res.json({ success: true, status: order.status });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Error tracking order" });
  }
};

// ✅ Help Desk (AI Assistant)
exports.helpdesk = async (req, res) => {
  const { question } = req.body;
  if (!question)
    return res.status(400).json({ success: false, message: "❓ Question is required" });

  // Future: ChatGPT integration
  res.json({
    success: true,
    reply: "🤖 AI: Dhanyavaad! Aapka prashna mil gaya. Jaldi reply milega.",
  });
};
