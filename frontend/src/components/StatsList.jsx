import React from "react";
import colors from "../styles/colors";

const StatsList = ({ stats }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    color: colors.brown
  }}>
    {stats.map((stat, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: stat.color || colors.gold
        }}></span>
        <span>{stat.value} {stat.label}</span>
      </div>
    ))}
  </div>
);

export default StatsList;
