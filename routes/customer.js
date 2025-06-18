// ✅ Core Imports
const express = require("express");
const router = express.Router();

// ✅ Controller Functions
const {
  loginCustomer,       // D1: Login
  logoutCustomer,      // D12: Logout
  getCustomerInfo,     // D3: Customer Info
  getProducts,         // D2: Load Products
  placeOrder,          // D5: Place Order
  trackOrder,          // D7: Track Order
  askHelpdesk          // D8–D11: Helpdesk AI Chat
} = require("../controllers/customerController");

// ✅ Middleware
const { verifyCustomer } = require("../middlewares/auth");

// ✅ D1: Customer Login
router.post("/login", loginCustomer);

// ✅ D12: Customer Logout
router.post("/logout", verifyCustomer, logoutCustomer);

// ✅ D3: Get Customer Info (Secure)
router.get("/info", verifyCustomer, getCustomerInfo);

// ✅ D2: Fetch All Products (Public)
router.get("/products", getProducts);

// ✅ D5: Place a New Order (Only if logged in)
router.post("/order", verifyCustomer, placeOrder);

// ✅ D7: Track Order by Order ID (Customer only)
router.get("/track/:orderId", verifyCustomer, trackOrder);

// ✅ D8–D11: Ask AI Helpdesk (Secure route)
router.post("/helpdesk/ask", verifyCustomer, askHelpdesk);

// 🛠️ D13–D25: Wallet, Wishlist, Feedback, etc. will come here

module.exports = router;
