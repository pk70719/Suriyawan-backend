const jwt = require('jsonwebtoken');

const ownerAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "🔒 Access Denied. No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    if (decoded.role !== 'owner') {
      return res.status(403).json({ success: false, message: "🚫 Unauthorized Access" });
    }
    req.owner = decoded;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "❌ Invalid Token" });
  }
};

module.exports = ownerAuth;
