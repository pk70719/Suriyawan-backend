// ✅ Load required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path'); // For serving uploads

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

// ✅ Load routes
const ownerRoutes = require('./routes/owner');
const sellerRoutes = require('./routes/seller');
const deliveryRoutes = require('./routes/delivery');
const customerRoutes = require('./routes/customer');
const uploadRoutes = require('./routes/uploadRoutes'); // Image Upload
const devRoutes = require('./routes/devRoutes');       // 🔧 Owner creation

// ✅ Route setup
app.use('/api/owner', ownerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api', uploadRoutes);
app.use('/api/dev', devRoutes); // ✅ Dev Route to create owner

// ✅ Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('🚀 Suriyawan Saffari Backend is Working!');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
