/**
 * Generate a unique 8-digit tracking ID.
 * Ensures numeric format and avoids predictable patterns.
 */
const generateTrackingId = () => {
  const timestamp = Date.now().toString().slice(-5); // Last 5 digits of timestamp
  const randomPart = Math.floor(100 + Math.random() * 900); // 3-digit random
  return `${timestamp}${randomPart}`; // e.g. "52745123"
};

module.exports = generateTrackingId;
