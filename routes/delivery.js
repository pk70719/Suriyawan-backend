const express = require("express");
const router = express.Router();

// 🔧 Controller Functions
const {
  register,
  login,
  assignments,
  updateStatus,
  updateCash,
  updateLocation,
  logout,
  profile
} = require("../controllers/deliveryController");

// 🔐 Middleware for Delivery Boy Auth
const { verifyDeliveryBoy } = require("../middlewares/auth");

// 🔓 Public Routes
router.post("/register", register); // D1: Register new delivery boy
router.post("/login", login);       // D2: Login delivery boy

// 🔐 Secure Routes
router.get("/assignments", verifyDeliveryBoy, assignments);       // D3: Assigned parcels
router.post("/update-status", verifyDeliveryBoy, updateStatus);   // D4: Update delivery status
router.post("/cash", verifyDeliveryBoy, updateCash);              // D5: Update cash collection
router.post("/location", verifyDeliveryBoy, updateLocation);      // D6: Live location update
router.post("/logout", verifyDeliveryBoy, logout);                // D7: Secure logout
router.get("/profile", verifyDeliveryBoy, profile);               // D8: Profile fetch

module.exports = router;
