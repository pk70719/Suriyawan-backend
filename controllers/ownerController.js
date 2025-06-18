const jwt = require("jsonwebtoken");

// 🔐 Use ENV for real credentials
const OWNER_USERNAME = process.env.OWNER_USERNAME || "pradeepseth646";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "gss626hPgeehghx56";
const JWT_SECRET = process.env.JWT_SECRET || "suriyawan1Super2SecretKey77";

// ✅ Owner Login
exports.loginOwner = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (username === OWNER_USERNAME && password === OWNER_PASSWORD) {
    const token = jwt.sign({ role: "owner", username }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

// ✅ Owner Dashboard Stats (Static Demo)
exports.getOwnerStats = async (req, res) => {
  try {
    // TODO: Replace static data with dynamic DB queries later
    res.json({
      success: true,
      stats: {
        totalOrders: 123,
        totalRevenue: "₹12,000",
        activeDeliveryBoys: 5,
        registeredSellers: 8,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load stats" });
  }
};
