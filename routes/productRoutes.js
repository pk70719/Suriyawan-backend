const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

const {
  addProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  toggleAvailability,
  getAllProductsForCustomer,
  assignProductToDelivery,
  getDeliveryProducts
} = require('../controllers/productController');


// ============================
// 📦 SELLER ROUTES (Protected)
// ============================

// ✅ Add a new product
router.post('/seller', verifyToken, addProduct);

// ✅ Get all products uploaded by seller
router.get('/seller', verifyToken, getSellerProducts);

// ✅ Update product info
router.put('/seller/:id', verifyToken, updateProduct);

// ✅ Delete a product
router.delete('/seller/:id', verifyToken, deleteProduct);

// ✅ Toggle product availability (active/inactive)
router.patch('/seller/:id/toggle', verifyToken, toggleAvailability);


// ================================
// 🚚 DELIVERY BOY ROUTES (Secure)
// ================================

// ✅ Assign product to delivery (e.g., part of run sheet)
router.post('/delivery/assign/:productId', verifyToken, assignProductToDelivery);

// ✅ Get assigned deliveries (products) for delivery boy
router.get('/delivery', verifyToken, getDeliveryProducts);


// ===============================
// 🛒 CUSTOMER ROUTES (Public View)
// ===============================

// ✅ Fetch all active products for customers (shop view)
router.get('/customer', getAllProductsForCustomer);


module.exports = router;
