import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate random 6 digit OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP mail
export const sendOtpMail = async (email, otp) => {
  const mailOptions = {
    from: `IMS App <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Password Reset",
    html: `
    <h2>Inventory Management System</h2>
    <p>Your OTP for password reset is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email:", email);
    return true;
  } catch (err) {
    console.error("Error sending OTP:", err);
    return false;
  }
};
