const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

// ✅ Controllers
const {
  sellerProfile,
  updateSeller
} = require('../controllers/sellerController');

const {
  deliveryProfile,
  updateDelivery
} = require('../controllers/deliveryController');

const {
  customerProfile,
  updateCustomer
} = require('../controllers/customerController');

// =======================
// 🧑‍💼 SELLER PROFILE
// =======================
router.get('/seller', verifyToken, sellerProfile);
router.put('/seller', verifyToken, updateSeller);

// ==========================
// 🚚 DELIVERY BOY PROFILE
// ==========================
router.get('/delivery', verifyToken, deliveryProfile);
router.put('/delivery', verifyToken, updateDelivery);

// =======================
// 👤 CUSTOMER PROFILE
// =======================
router.get('/customer', verifyToken, customerProfile);
router.put('/customer', verifyToken, updateCustomer);

module.exports = router;
