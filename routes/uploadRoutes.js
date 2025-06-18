const express = require("express");
const router = express.Router();

// 🧩 Middleware for image upload (Multer)
const upload = require("../middleware/upload");

// 🎯 Controller that handles image processing/saving
const { uploadUserImage } = require("../controllers/uploadController");

// ✅ Upload User Image (Seller, Customer, Delivery)
// Route: POST /api/upload/:role/:id
// Body: image (as 'image' field in FormData)
router.post("/upload/:role/:id", upload.single("image"), uploadUserImage);

module.exports = router;
