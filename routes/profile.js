const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

// ✅ Seller Controllers
const {
  sellerProfile,
  updateSeller
} = require('../controllers/sellerController');

// ✅ Delivery Boy Controllers
const {
  deliveryProfile,
  updateDelivery
} = require('../controllers/deliveryController');

// ✅ Customer Controllers
const {
  customerProfile,
  updateCustomer
} = require('../controllers/customerController');

// =======================
// 🧑‍💼 SELLER PROFILE ROUTES
// =======================
router.get('/seller', verifyToken, sellerProfile);
router.put('/seller', verifyToken, updateSeller);

// ==========================
// 🚚 DELIVERY BOY PROFILE ROUTES
// ==========================
router.get('/delivery', verifyToken, deliveryProfile);
router.put('/delivery', verifyToken, updateDelivery);

// =======================
// 👤 CUSTOMER PROFILE ROUTES
// =======================
router.get('/customer', verifyToken, customerProfile);
router.put('/customer', verifyToken, updateCustomer);

module.exports = router;
