const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Dynamic destination folder based on role
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const urlParts = req.originalUrl.split("/");

    let role = "common";
    if (urlParts.includes("seller")) role = "seller";
    else if (urlParts.includes("customer")) role = "customer";
    else if (urlParts.includes("delivery")) role = "delivery";
    else if (urlParts.includes("owner")) role = "owner";

    const uploadPath = path.join(__dirname, `../uploads/${role}`);

    // ✅ Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_").toLowerCase();
    cb(null, `${timestamp}_${safeName}`);
  },
});

// ✅ Only image files filter
const fileFilter = (req, file, cb) => {
  const allowedExts = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only image files (.jpeg, .jpg, .png, .webp) are allowed"));
  }
};

// ✅ Max file size = 3MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});

module.exports = upload;
