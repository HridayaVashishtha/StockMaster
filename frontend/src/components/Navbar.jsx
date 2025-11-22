import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import colors from "../styles/colors";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [openSettings, setOpenSettings] = useState(false);
  const settingsRef = useRef(null);
  const [openOperations, setOpenOperations] = useState(false);
  const operationsRef = useRef(null);

  const items = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Operations", to: "#" },
    { label: "Stock", to: "/stock" },
    { label: "Move History", to: "/move-history" },
    { label: "Settings", to: "#" }
  ];

  const active = (to) => {
    if (to === "#") return false;
    return location.pathname.startsWith(to);
  };

  const isSettingsActive = () => {
    return location.pathname.startsWith("/warehouse") || location.pathname.startsWith("/location");
  };

  const isOperationsActive = () => {
    return location.pathname.startsWith("/receipts") || 
           location.pathname.startsWith("/deliveries") || 
           location.pathname.startsWith("/adjustments");
  };

  const initial = (localStorage.getItem("name") || "A").charAt(0).toUpperCase();

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setOpenSettings(false);
      }
      if (operationsRef.current && !operationsRef.current.contains(e.target)) {
        setOpenOperations(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOpenSettings(false);
        setOpenOperations(false);
      }
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
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {items.map(({ label, to }) => {
          if (label === "Operations") {
            return (
              <div
                key={label}
                ref={operationsRef}
                style={{ position: "relative" }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenOperations(!openOperations);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: colors.cream,
                    background: "transparent",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: isOperationsActive() ? "700" : "500",
                    padding: "8px 4px",
                    borderBottom: isOperationsActive()
                      ? `2px solid ${colors.gold}`
                      : "2px solid transparent",
                    transition: "all 0.2s",
                    cursor: "pointer"
                  }}
                >
                  {label}
                  <ChevronDown 
                    size={16} 
                    style={{
                      transform: openOperations ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s"
                    }}
                  />
                </button>

                {openOperations && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
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
                      to="/receipts"
                      onClick={() => setOpenOperations(false)}
                      style={{
                        display: "block",
                        padding: "12px 16px",
                        color: colors.brown,
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: location.pathname.startsWith("/receipts") ? "700" : "500",
                        background: location.pathname.startsWith("/receipts") ? colors.cream : "white",
                        borderBottom: `1px solid ${colors.cream}`,
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        if (!location.pathname.startsWith("/receipts")) {
                          e.target.style.background = colors.cream;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!location.pathname.startsWith("/receipts")) {
                          e.target.style.background = "white";
                        }
                      }}
                    >
                      Receipt
                    </Link>
                    <Link
                      to="/deliveries"
                      onClick={() => setOpenOperations(false)}
                      style={{
                        display: "block",
                        padding: "12px 16px",
                        color: colors.brown,
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: location.pathname.startsWith("/deliveries") ? "700" : "500",
                        background: location.pathname.startsWith("/deliveries") ? colors.cream : "white",
                        borderBottom: `1px solid ${colors.cream}`,
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        if (!location.pathname.startsWith("/deliveries")) {
                          e.target.style.background = colors.cream;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!location.pathname.startsWith("/deliveries")) {
                          e.target.style.background = "white";
                        }
                      }}
                    >
                      Delivery
                    </Link>
                    <Link
                      to="/adjustments"
                      onClick={() => setOpenOperations(false)}
                      style={{
                        display: "block",
                        padding: "12px 16px",
                        color: colors.brown,
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: location.pathname.startsWith("/adjustments") ? "700" : "500",
                        background: location.pathname.startsWith("/adjustments") ? colors.cream : "white",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        if (!location.pathname.startsWith("/adjustments")) {
                          e.target.style.background = colors.cream;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!location.pathname.startsWith("/adjustments")) {
                          e.target.style.background = "white";
                        }
                      }}
                    >
                      Adjustment
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          if (label === "Settings") {
            return (
              <div
                key={label}
                ref={settingsRef}
                style={{ position: "relative" }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSettings(!openSettings);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: colors.cream,
                    background: "transparent",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: isSettingsActive() ? "700" : "500",
                    padding: "8px 4px",
                    borderBottom: isSettingsActive()
                      ? `2px solid ${colors.gold}`
                      : "2px solid transparent",
                    transition: "all 0.2s",
                    cursor: "pointer"
                  }}
                >
                  {label}
                  <ChevronDown 
                    size={16} 
                    style={{
                      transform: openSettings ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s"
                    }}
                  />
                </button>

                {openSettings && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
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
                      to="/warehouse"
                      onClick={() => setOpenSettings(false)}
                      style={{
                        display: "block",
                        padding: "12px 16px",
                        color: colors.brown,
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: location.pathname.startsWith("/warehouse") ? "700" : "500",
                        background: location.pathname.startsWith("/warehouse") ? colors.cream : "white",
                        borderBottom: `1px solid ${colors.cream}`,
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        if (!location.pathname.startsWith("/warehouse")) {
                          e.target.style.background = colors.cream;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!location.pathname.startsWith("/warehouse")) {
                          e.target.style.background = "white";
                        }
                      }}
                    >
                      Warehouse
                    </Link>
                    <Link
                      to="/location"
                      onClick={() => setOpenSettings(false)}
                      style={{
                        display: "block",
                        padding: "12px 16px",
                        color: colors.brown,
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: location.pathname.startsWith("/location") ? "700" : "500",
                        background: location.pathname.startsWith("/location") ? colors.cream : "white",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        if (!location.pathname.startsWith("/location")) {
                          e.target.style.background = colors.cream;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!location.pathname.startsWith("/location")) {
                          e.target.style.background = "white";
                        }
                      }}
                    >
                      Location
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={label}
              to={to}
              style={{
                color: colors.cream,
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: active(to) ? "700" : "500",
                padding: "8px 4px",
                borderBottom: active(to)
                  ? `2px solid ${colors.gold}`
                  : "2px solid transparent",
                transition: "all 0.2s"
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative" }} ref={menuRef}>
        <span style={{ color: colors.cream, fontSize: "16px", fontWeight: "600" }}>
          {items.find(i => active(i.to))?.label || 
           (isSettingsActive() ? "Settings" : 
            isOperationsActive() ? "Operations" : "Dashboard")}
        </span>

        <button
          type="button"
          onClick={() => setOpen(!open)}
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

        {open && (
          <div
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