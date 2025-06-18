const generateTrackingId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString(); // 8-digit random
};

module.exports = generateTrackingId;
