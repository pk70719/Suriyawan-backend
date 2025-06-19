// ✅ Load required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize express app
const app = express();

// ✅ Middleware setup
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import all routes
const ownerRoutes = require('./routes/owner');
const sellerRoutes = require('./routes/seller');
const deliveryRoutes = require('./routes/delivery');
const customerRoutes = require('./routes/customer');
const uploadRoutes = require('./routes/upload');           // 🔁 Corrected name to match file
const trackingRoutes = require('./routes/tracking');       // 🔁 Corrected name to match file
const profileRoutes = require('./routes/profile');         // ✅ Profile route
const productRoutes = require('./routes/product');         // ✅ Product route

// ✅ Route setup
app.use('/api/owner', ownerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/product', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tracking', trackingRoutes);

// ✅ Serve uploaded images publicly (access via /uploads/role/filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('🚀 Suriyawan Saffari Backend is Live!');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
