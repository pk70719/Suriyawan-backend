// middlewares/ownerAuth.js

const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

const JWT_SECRET = process.env.JWT_SECRET || "suriyawan1Super2SecretKey77";

const ownerAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "🔒 Access denied. Token missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "🚫 Unauthorized: Not an owner",
      });
    }

    const owner = await Owner.findOne({ email: decoded.username });
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "❌ Owner not found in database",
      });
    }

    req.owner = { id: owner._id, email: owner.email, role: "owner" };
    next();
  } catch (err) {
    console.error("Token Verification Failed:", err.message);
    return res.status(401).json({
      success: false,
      message: "❌ Invalid or expired token",
      error: err.message,
    });
  }
};

module.exports = ownerAuth;
