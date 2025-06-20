// ✅ Load required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// ✅ Load .env variables
dotenv.config();

// ✅ Initialize express app
const app = express();

// ✅ Middleware setup
app.use(cors({
  origin: "https://pk70719.github.io",  // ✅ frontend domain (change if needed)
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev")); // ✅ optional: logs all requests

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/suriyawan", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import Routes
const ownerRoutes = require('./routes/owner');
const sellerRoutes = require('./routes/seller');
const deliveryRoutes = require('./routes/delivery');
const customerRoutes = require('./routes/customer');
const uploadRoutes = require('./routes/upload');
const trackingRoutes = require('./routes/tracking');
const profileRoutes = require('./routes/profile');
const productRoutes = require('./routes/product');

// ✅ Use Routes
app.use('/api/owner', ownerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/product', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tracking', trackingRoutes);

// ✅ Static File Serving (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('🚀 Suriyawan Saffari Backend is Live!');
});

// ✅ Global Error Handler (optional but helpful)
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ success: false, message: "⚠️ Something broke on the server." });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
