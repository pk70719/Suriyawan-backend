const jwt = require("jsonwebtoken");

/**
 * 🔐 Middleware: Verify JWT Token
 * Checks if the request has a valid JWT token.
 * Injects user data into req.user if valid.
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbackSecret");

    if (!decoded || !decoded.role || !decoded.username) {
      return res.status(403).json({
        success: false,
        message: "❌ Invalid token payload",
      });
    }

    // ✅ Attach decoded user to request
    req.user = {
      username: decoded.username,
      role: decoded.role,
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
