const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET = process.env.JWT_SECRET || "suriyawan-secret";

// 🔐 Token Create
function createToken(customer) {
  return jwt.sign({ id: customer._id, role: "customer" }, SECRET, { expiresIn: "7d" });
}

// 🔐 Token Verify
function verifyToken(req) {
  const token =
    req.cookies?.customerToken ||
    (req.headers.authorization?.startsWith("Bearer ") &&
      req.headers.authorization.split(" ")[1]);

  if (!token) return null;

  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// ✅ 1. Customer Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile, address } = req.body;

    if (!name || !email || !password || !mobile || !address) {
      return res.status(400).json({ success: false, message: "❌ All fields are required" });
    }

    const emailLower = email.toLowerCase();

    const exists = await Customer.findOne({ email: emailLower });
    if (exists)
      return res.status(409).json({ success: false, message: "❗ Email already registered" });

    const mobileExists = await Customer.findOne({ mobile });
    if (mobileExists)
      return res.status(409).json({ success: false, message: "❗ Mobile number already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await Customer.create({
      name,
      email: emailLower,
      password: hashedPassword,
      mobile,
      address,
    });

    res.status(201).json({ success: true, message: "✅ Registration successful" });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ success: false, message: "❌ Server error during registration" });
  }
};

// ✅ 2. Customer Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "📧 Email aur 🔑 password required hai." });

    const emailLower = email.toLowerCase();
    const user = await Customer.findOne({ email: emailLower });

    if (!user)
      return res.status(401).json({ success: false, message: "❌ Invalid credentials (email)." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "❌ Invalid credentials (password)." });

    const token = createToken(user);

    res
      .cookie("customerToken", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production" // ✅ false for localhost
      })
      .json({
        success: true,
        message: "✅ लॉगिन सफल!",
        token,
        customer: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        },
      });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// ✅ 3. Customer Info
exports.info = async (req, res) => {
  const auth = verifyToken(req);
  if (!auth) return res.status(401).json({ success: false, message: "🔐 Unauthorized" });

  try {
    const user = await Customer.findById(auth.id).select("name email mobile");
    if (!user)
      return res.status(404).json({ success: false, message: "❌ Customer not found" });

    res.json({ success: true, customer: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Error while fetching info" });
  }
};

// ✅ 4. Logout
exports.logout = (req, res) => {
  res.clearCookie("customerToken").json({ success: true, message: "👋 Logged out successfully" });
};

// ✅ 5. Load All Products
exports.products = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ Product loading failed" });
  }
};

// ✅ 6. Place Order
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

// ✅ 7. Track Order
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

// ✅ 8. AI Help Desk (Placeholder)
exports.helpdesk = async (req, res) => {
  const { question } = req.body;
  if (!question)
    return res.status(400).json({ success: false, message: "❓ Question is required" });

  res.json({
    success: true,
    reply: "🤖 AI: Dhanyavaad! Aapka prashna mil gaya. Jaldi reply milega.",
  });
};
