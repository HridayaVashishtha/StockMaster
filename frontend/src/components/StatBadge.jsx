import React from "react";
import colors from "../styles/colors";

const StatBadge = ({ count, label }) => (
  <div style={{
    backgroundColor: colors.gold,
    color: colors.brown,
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    {count} {label}
  </div>
);

export default StatBadge;
