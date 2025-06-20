const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const { verifyToken } = require("../middlewares/verifyToken");

// ✅ Unified Profile Routes for all roles
router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateProfile);

module.exports = router;
