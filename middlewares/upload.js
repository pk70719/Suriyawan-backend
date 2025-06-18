const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔧 Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const role = req.params.role || 'common'; // seller / customer / delivery / owner
    const uploadPath = `uploads/${role}`;

    // Create role-based folder if not exists
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

// ✅ File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only .jpeg, .jpg, .png, .webp files allowed"), false);
  }
};

// ✅ Upload setup
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024 // Max 3MB file
  }
});

module.exports = upload;
