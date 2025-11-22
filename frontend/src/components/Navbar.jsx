import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import colors from "../styles/colors";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const items = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Operations", to: "/operations" },
    { label: "Stock", to: "/stock" },
    { label: "Move History", to: "/history" },
    { label: "Settings", to: "/settings" }
  ];

  const active = (to) => location.pathname.startsWith(to);
  const initial = (localStorage.getItem("name") || "A").charAt(0).toUpperCase();

  // Close on outside click or Esc
  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setOpen(false);
    navigate("/login");
  };

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

      <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative" }} ref={menuRef}>
        <span style={{ color: colors.cream, fontSize: "16px", fontWeight: "600" }}>
          {items.find(i => active(i.to))?.label || "Dashboard"}
        </span>

        {/* Profile trigger */}
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          title="Profile menu"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: colors.gold,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.brown,
            fontWeight: 700,
            fontSize: "14px",
            border: `1px solid ${colors.brown}`,
            cursor: "pointer"
          }}
        >
          {initial}
        </button>

        {/* Dropdown */}
        {open && (
          <div
            role="menu"
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              minWidth: "180px",
              background: "#fff",
              border: `1px solid ${colors.gold}`,
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              overflow: "hidden",
              zIndex: 1000
            }}
          >
            <Link
              role="menuitem"
              to="/profile"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                color: colors.brown,
                textDecoration: "none",
                borderBottom: `1px solid ${colors.cream}`,
                background: "white",
                fontWeight: 600
              }}
            >
              My Profile
            </Link>
            <button
              role="menuitem"
              onClick={handleLogout}
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                background: colors.cream,
                color: colors.brown,
                border: "none",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;