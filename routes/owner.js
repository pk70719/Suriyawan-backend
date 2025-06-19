// ✅ Updated login route (password removed)
router.post("/login", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ success: false, message: "Username required" });

  const owner = await Owner.findOne({ email: username.toLowerCase() });
  if (!owner) return res.status(401).json({ success: false, message: "Owner not found" });

  const token = jwt.sign(
    { role: owner.role, username: owner.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ success: true, message: "✅ Login successful", token, owner });
});
