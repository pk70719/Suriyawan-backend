const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

// ✅ Product Controller Functions
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

// ==============================
// 📦 SELLER PRODUCT OPERATIONS
// ==============================

// ✅ Add new product (Only Seller)
router.post('/seller', verifyToken, addProduct);

// ✅ Get seller’s own products
router.get('/seller', verifyToken, getSellerProducts);

// ✅ Update product by ID
router.put('/seller/:id', verifyToken, updateProduct);

// ✅ Delete product by ID
router.delete('/seller/:id', verifyToken, deleteProduct);

// ✅ Toggle availability (active/inactive)
router.patch('/seller/:id/toggle', verifyToken, toggleAvailability);

// ==============================
// 🚚 DELIVERY BOY OPERATIONS
// ==============================

// ✅ Assign product to delivery
router.post('/delivery/assign/:productId', verifyToken, assignProductToDelivery);

// ✅ Get products assigned to delivery boy
router.get('/delivery', verifyToken, getDeliveryProducts);

// ==============================
// 🛒 CUSTOMER PRODUCT VIEW
// ==============================

// ✅ Get all active products (visible to customers)
router.get('/customer', getAllProductsForCustomer);

module.exports = router;
