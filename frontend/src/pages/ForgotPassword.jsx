import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { injectGlobalStyles } from "../styles/colors";

export default function ForgotPassword() {
  injectGlobalStyles();

  const [step, setStep] = useState(1); // 1: request OTP, 2: verify & reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/auth/request-otp", { email });
      if (res.data.error) {
        setMsg(res.data.error);
      } else {
        setMsg(res.data.message || "OTP sent to your email");
        setStep(2);
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/auth/reset-password", { email, otp, newPassword });
      if (res.data.error) {
        setMsg(res.data.error);
      } else {
        setMsg(res.data.message || "Password reset successful");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Password reset failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ marginBottom: "16px" }}>Forgot Passsword ?</h2>
          {/* Replace the src below with your actual logo path */}
          <img 
            src="/vite.png" 
            alt="Logo" 
            style={{ width: "80px", height: "80px", objectFit: "contain" }} 
          />
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestOTP}>
            <input
              className="input"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Send OTP</button>
            <div className="msg">{msg}</div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <input
              className="input"
              type="text"
              placeholder="Enter 6-digit OTP"
              required
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="New Password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Reset Password</button>
            <div className="msg">{msg}</div>
          </form>
        )}

        <div className="auth-alt">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}