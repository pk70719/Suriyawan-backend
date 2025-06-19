const express = require("express");
const router = express.Router();
const path = require("path");

// ✅ Multer middleware (for file upload)
const upload = require("../middlewares/upload");

// ✅ Controller to handle DB image update
const { uploadUserImage } = require("../controllers/uploadController");

// ✅ 📤 Image Upload Route
router.post("/upload/:role/:id", upload.single("image"), async (req, res) => {
  try {
    const { role, id } = req.params;

    // ✅ File validation
    if (!req.file) {
      return res.status(400).json({ success: false, message: "❌ No image uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // ✅ Update user record in DB
    const updatedUser = await uploadUserImage(role, id, imageUrl);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "❌ User not found or role invalid" });
    }

    res.json({
      success: true,
      message: "✅ Image uploaded successfully",
      imageUrl,
      user: updatedUser
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: "❌ Server error during upload" });
  }
});

module.exports = router;
