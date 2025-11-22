import React from "react";
import { Link, useLocation } from "react-router-dom";
import colors from "../styles/colors";

const Navbar = () => {
  const location = useLocation();
  const items = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Operations", to: "/operations" },
    { label: "Stock", to: "/stock" },
    { label: "Move History", to: "/history" },
    { label: "Settings", to: "/settings" }
  ];

  const active = (to) => location.pathname.startsWith(to);
  const initial = (localStorage.getItem("name") || "A").charAt(0).toUpperCase();

  return (
    <nav
      style={{
        backgroundColor: colors.brown,
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `3px solid ${colors.gold}`
      }}
    >
      <div style={{ display: "flex", gap: "32px" }}>
        {items.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            style={{
              color: colors.cream,
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: active(to) ? "700" : "500",
              padding: "8px 4px",
              borderBottom: active(to) ? `2px solid ${colors.gold}` : "2px solid transparent",
              transition: "all 0.2s"
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ color: colors.cream, fontSize: "16px", fontWeight: "600" }}>
          {items.find(i => active(i.to))?.label || "Dashboard"}
        </span>
        <Link
          to="/profile"
          title="Profile"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: colors.gold,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.brown,
            fontWeight: "700",
            fontSize: "14px",
            textDecoration: "none",
            border: `1px solid ${colors.brown}`
          }}
        >
          {initial}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;