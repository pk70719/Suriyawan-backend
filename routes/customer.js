const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer"); // 👈 Required to create new customer

// ===============================
// 📝 D0: Customer Registration (Public)
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobile, address } = req.body;

    if (!name || !email || !password || !mobile || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if email already exists
    const existingEmail = await Customer.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // Check if mobile already exists
    const existingMobile = await Customer.findOne({ mobile });
    if (existingMobile) {
      return res.status(409).json({ success: false, message: "Mobile number already registered" });
    }

    const newCustomer = new Customer({ name, email, password, mobile, address });
    await newCustomer.save();

    res.json({ success: true, message: "Customer registered successfully!" });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({ success: false, message: "Server error. Try again." });
  }
});

// ===============================
// 📦 Controller Functions
// ===============================
const {
  login,
  logout,
  info,
  products,
  order,
  track,
  helpdesk
} = require("../controllers/customerController");

// ===============================
// 🔐 Middleware
// ===============================
const { verifyCustomer } = require("../middlewares/auth");

// ===============================
// 🧾 D1: Customer Login (Public)
// ===============================
router.post("/login", login);

// ===============================
// 🚪 D12: Logout (Secure)
// ===============================
router.post("/logout", verifyCustomer, logout);

// ===============================
// 👤 D3: Customer Info (Secure)
// ===============================
router.get("/info", verifyCustomer, info);

// ===============================
// 🛍️ D2: All Products (Public)
// ===============================
router.get("/products", products);

// ===============================
// 🛒 D5: Place Order (Secure)
// ===============================
router.post("/order", verifyCustomer, order);

// ===============================
// 📦 D7: Track Order (Secure)
// ===============================
router.get("/track/:orderId", verifyCustomer, track);

// ===============================
// 🤖 D8–D11: AI Helpdesk (Secure)
// ===============================
router.post("/helpdesk/ask", verifyCustomer, helpdesk);

// ===============================
// 🔮 Future Features:
// Wishlist, Wallet, Referrals, Feedback, Ratings, etc.
// ===============================

module.exports = router;
