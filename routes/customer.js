const express = require("express");
const router = express.Router();

// 📦 Controller Functions
const {
  login,
  logout,
  info,
  products,
  order,
  track,
  helpdesk
} = require("../controllers/customerController");

// 🔐 Middleware
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
