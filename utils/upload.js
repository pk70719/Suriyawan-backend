const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Base upload directory: /uploads
const baseDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

// ✅ Create folder for each role dynamically (seller, customer, delivery)
const getUploadPath = (role) => {
  const dir = path.join(baseDir, role.toLowerCase());
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userRole = req.params.role || req.body.role || 'general';
    const uploadPath = getUploadPath(userRole);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

// ✅ Only allow image files
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

// ✅ Create multer instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Max 5MB
  }
});

module.exports = upload;
