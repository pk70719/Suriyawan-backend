const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🔧 Base upload directory: /uploads
const baseDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

// 📂 Dynamically create folders for roles (seller, customer, delivery)
const getUploadPath = (role) => {
  const dir = path.join(baseDir, role.toLowerCase());
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// 💾 Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get role from route param, body, or user object
    const userRole = req.params.role || req.body.role || req.user?.role || 'general';
    const uploadPath = getUploadPath(userRole);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

// 🔒 Optional file filter (images only)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  if (allowed.test(ext) && allowed.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only image files are allowed (jpg, png, gif, webp)"));
  }
};

// ✅ Export configured multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Max file size = 5MB
  }
});

module.exports = upload;
