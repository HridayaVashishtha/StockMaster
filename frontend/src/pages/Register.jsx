import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { injectGlobalStyles } from "../styles/colors";

export default function Register() {
  injectGlobalStyles();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("WarehouseStaff");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/auth/register", { name, email, password, role });
      if (res.data.error) {
        setMsg(res.data.error);
      } else {
        setMsg(res.data.message || "Registered successfully");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ marginBottom: "16px" }}>Welcome to Stock Master!</h2>
          {/* Replace the src below with your actual logo path */}
          <img 
            src="/vite.png" 
            alt="Logo" 
            style={{ width: "80px", height: "80px", objectFit: "contain" }} 
          />
        </div>
        
        <form onSubmit={handleRegister}>
          <input
            className="input"
            type="text"
            placeholder="Name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="WarehouseStaff">Warehouse Staff</option>
            <option value="InventoryManager">Inventory Manager</option>
          </select>
          <button className="btn btn-primary" type="submit">Create Account</button>
          <div className="msg">{msg}</div>
        </form>
        <div className="auth-alt">
          Have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}