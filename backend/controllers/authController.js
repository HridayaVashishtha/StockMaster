import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOtp, sendOtpMail } from "../utils/sendOtp.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashed, role });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    res.json({ token });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Request OTP
export const requestOTP = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "Email not found" });

  const otp = generateOtp();

  user.resetOTP = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
  await user.save();

  await sendOtpMail(email, otp);

  res.json({ message: "OTP sent to email" });
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "Invalid email" });

  if (user.resetOTP !== otp || user.otpExpiry < Date.now()) {
    return res.json({ error: "OTP is invalid or expired" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetOTP = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Password reset successful" });
};
