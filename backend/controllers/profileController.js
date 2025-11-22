import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET /api/profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.userId).select("name email role createdAt updatedAt");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  const { name, email, role } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;

  // Allow role change only if current user is InventoryManager
  if (role && req.userRole === "InventoryManager") {
    updates.role = role;
  }

  // Ensure email uniqueness if changed
  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: req.userId } });
    if (existing) return res.json({ error: "Email already in use" });
  }

  const user = await User.findByIdAndUpdate(req.userId, updates, {
    new: true,
    runValidators: true,
  }).select("name email role createdAt updatedAt");

  res.json({ message: "Profile updated", user });
};

// PUT /api/profile/password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return res.json({ error: "Current password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated" });
};