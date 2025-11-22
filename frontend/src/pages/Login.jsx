import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AuthStyles.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/auth/login", { email, password });
      if (res.data.error) {
        setMsg(res.data.error);
      } else if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setMsg("Login successful");
        // Redirect to dashboard or home
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
          <div className="msg">{msg}</div>
        </form>
        <div className="auth-alt">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="auth-alt">
          Need an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
