const jwt = require("jsonwebtoken");

// 📌 Generic Token Verifier (adds req.user with { id, role })
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "🔒 Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourFallbackSecret");
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(403).json({ success: false, message: "⛔ Invalid token payload" });
    }

    // ✅ Inject decoded data into request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "❌ Token invalid or expired", error: err.message });
  }
};

module.exports = verifyToken;
