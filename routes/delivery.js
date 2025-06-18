const express = require("express");
const router = express.Router();

// ✅ Import Delivery Controller
const deliveryController = require("../controllers/deliveryController");

// ✅ Import DeliveryBoy Auth Middleware
const { verifyDeliveryBoy } = require("../middlewares/auth");

// 🔓 Public Routes
router.post("/register", deliveryController.register);
router.post("/login", deliveryController.login);

// 🔐 Protected Routes (DeliveryBoy Only)
router.get("/assignments", verifyDeliveryBoy, deliveryController.assignments);
router.post("/update-status", verifyDeliveryBoy, deliveryController.updateStatus);
router.post("/cash", verifyDeliveryBoy, deliveryController.updateCash);
router.post("/location", verifyDeliveryBoy, deliveryController.updateLocation);

module.exports = router;
