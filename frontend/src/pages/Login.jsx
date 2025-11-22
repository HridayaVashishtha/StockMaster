import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { injectGlobalStyles } from "../styles/colors";

export default function Login() {
  injectGlobalStyles();

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
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("role", res.data.role);
        setMsg("Login successful");
        setTimeout(() => navigate("/profile"), 800);
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
            className="input"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Sign In</button>
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
