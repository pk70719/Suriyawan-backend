const express = require("express");
const router = express.Router();

// ✅ FIXED path: Make sure this path exists
const { getProfile, updateProfile } = require("../controllers/profileController");

// ✅ FIXED token middleware path
const verifyToken = require("../middlewares/verifyToken");

// ✅ PROFILE ROUTES (All roles: owner, seller, customer, delivery)
router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateProfile);

module.exports = router;
