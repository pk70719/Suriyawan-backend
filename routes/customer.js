// ✅ Core Imports
const express = require("express");
const router = express.Router();

// ✅ Controller Functions (fixed names)
const {
  login,
  logout,
  info,
  products,
  order,
  track,
  helpdesk
} = require("../controllers/customerController");

// ✅ Middleware
const { verifyCustomer } = require("../middlewares/auth");

// ✅ D1: Customer Login
router.post("/login", login);

// ✅ D12: Customer Logout
router.post("/logout", verifyCustomer, logout);

// ✅ D3: Get Customer Info (Secure)
router.get("/info", verifyCustomer, info);

// ✅ D2: Fetch All Products (Public)
router.get("/products", products);

// ✅ D5: Place a New Order (Only if logged in)
router.post("/order", verifyCustomer, order);

// ✅ D7: Track Order by Order ID (Customer only)
router.get("/track/:orderId", verifyCustomer, track);

// ✅ D8–D11: Ask AI Helpdesk (Secure route)
router.post("/helpdesk/ask", verifyCustomer, helpdesk);

// 🛠️ D13–D25: Wallet, Wishlist, Feedback, etc. will come here

module.exports = router;
