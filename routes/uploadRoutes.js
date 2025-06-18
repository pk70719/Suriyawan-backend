const express = require("express");
const router = express.Router();

// ✅ FIX: Corrected import path
const upload = require("../middlewares/upload");

// ✅ Controller
const { uploadUserImage } = require("../controllers/uploadController");

// ✅ Upload User Image
router.post("/upload/:role/:id", upload.single("image"), uploadUserImage);

module.exports = router;
