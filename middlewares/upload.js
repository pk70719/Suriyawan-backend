const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Dynamic folder creation based on role in URL
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ✅ Extract role from URL if params not yet parsed
    const urlParts = req.originalUrl.split('/');
    const role = urlParts.includes("seller")
      ? "seller"
      : urlParts.includes("customer")
      ? "customer"
      : urlParts.includes("delivery")
      ? "delivery"
      : urlParts.includes("owner")
      ? "owner"
      : "common";

    const uploadPath = `uploads/${role}`;

    // ✅ Create folder if doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  }
});

// ✅ Allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only .jpeg, .jpg, .png, .webp files allowed"), false);
  }
};

// ✅ Multer config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB
  }
});

module.exports = upload;
