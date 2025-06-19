const jwt = require('jsonwebtoken');

/**
 * Generate a secure JWT token.
 * @param {Object} payload - Data to encode (e.g. { id, role, username })
 * @param {String} [expiresIn='2h'] - Token expiry (optional, default 2 hours)
 * @returns {String} JWT token string or null if error
 */
const generateToken = (payload, expiresIn = '2h') => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    console.error("❌ Token generation failed:", error.message);
    return null;
  }
};

module.exports = generateToken;
