const express = require('express');
const router = express.Router();

// 🔄 Controllers
const {
  sellerLogin,
  sellerRegister,
  sellerProfile,
  updateSeller
} = require('../controllers/sellerController');

const {
  deliveryLogin,
  deliveryRegister,
  deliveryProfile,
  updateDelivery
} = require('../controllers/deliveryController');

const {
  customerLogin,
  customerRegister,
  customerProfile,
  updateCustomer
} = require('../controllers/customerController');

const {
  ownerLogin,
  ownerProfile,
  updateOwner
} = require('../controllers/ownerController');

// 🔐 Middlewares
const {
  verifySeller,
  verifyCustomer,
  verifyDeliveryBoy,
  verifyOwner
} = require('../middlewares/auth');

// ==============================
// 📦 Seller Routes
// ==============================
router.post('/seller/register', sellerRegister);
router.post('/seller/login', sellerLogin);
router.get('/seller/profile', verifySeller, sellerProfile);
router.put('/seller/profile', verifySeller, updateSeller);

// ==============================
// 🚚 Delivery Boy Routes
// ==============================
router.post('/delivery/register', deliveryRegister);
router.post('/delivery/login', deliveryLogin);
router.get('/delivery/profile', verifyDeliveryBoy, deliveryProfile);
router.put('/delivery/profile', verifyDeliveryBoy, updateDelivery);

// ==============================
// 👥 Customer Routes
// ==============================
router.post('/customer/register', customerRegister);
router.post('/customer/login', customerLogin);
router.get('/customer/profile', verifyCustomer, customerProfile);
router.put('/customer/profile', verifyCustomer, updateCustomer);

// ==============================
// 👑 Owner Routes
// ==============================
router.post('/owner/login', ownerLogin);
router.get('/owner/profile', verifyOwner, ownerProfile);
router.put('/owner/profile', verifyOwner, updateOwner);

module.exports = router;
