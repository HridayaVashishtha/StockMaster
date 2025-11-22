import React from "react";
import colors from "../styles/colors";
import StatBadge from "./StatBadge";
import StatsList from "./StatsList";

const DashboardCard = ({ title, badgeCount, badgeLabel, stats }) => (
  <div style={{
    backgroundColor: colors.cream,
    border: `2px solid ${colors.brown}`,
    borderRadius: '16px',
    padding: '24px',
    flex: 1,
    minWidth: '280px',
    boxShadow: '0 4px 12px rgba(117, 78, 26, 0.15)'
  }}>
    <h2 style={{
      color: colors.brown,
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      borderBottom: `2px solid ${colors.sage}`,
      paddingBottom: '12px'
    }}>
      {title}
    </h2>
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '24px'
    }}>
      <StatBadge count={badgeCount} label={badgeLabel} />
      <StatsList stats={stats} />
    </div>
  </div>
);

export default DashboardCard;
