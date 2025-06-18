const Seller = require('../models/Seller');
const Product = require('../models/Product');

// ✅ Get Seller Profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select('-password');
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }
    res.json({ success: true, seller });
  } catch (err) {
    console.error('Error fetching seller profile:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ✅ Update Seller Profile
exports.updateSellerProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedSeller = await Seller.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedSeller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    res.json({ success: true, message: 'Profile updated', seller: updatedSeller });
  } catch (err) {
    console.error('Error updating seller profile:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ✅ Delete Seller Account
exports.deleteSeller = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: 'Seller account deleted successfully' });
  } catch (err) {
    console.error('Error deleting seller:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ✅ Get Products Belonging to Seller
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });
    res.json({ success: true, products });
  } catch (err) {
    console.error('Error fetching seller products:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
