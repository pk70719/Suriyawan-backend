const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "suriyawan1Super2SecretKey77";

/**
 * 🔐 Middleware: Verify JWT Token
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "🔒 Token missing or improperly formatted",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.role || !decoded.username) {
      return res.status(403).json({
        success: false,
        message: "❌ Invalid token payload",
      });
    }

    // ✅ Inject decoded info into req.user
    req.user = {
      username: decoded.username,
      role: decoded.role,
      id: decoded.id || null,
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "❌ Token is invalid or expired",
      error: error.message,
    });
  }
};

module.exports = verifyToken;
