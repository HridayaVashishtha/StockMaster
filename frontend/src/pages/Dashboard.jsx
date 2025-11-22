import React from "react";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import colors from "../styles/colors";


export default function Dashboard() {
  const receiptData = {
    title: 'Receipt',
    badgeCount: 4,
    badgeLabel: 'to receive',
    stats: [
      { value: 1, label: 'Late', color: '#dc2626' },
      { value: 6, label: 'operations', color: colors.sage }
    ]
  };

  const deliveryData = {
    title: 'Delivery',
    badgeCount: 4,
    badgeLabel: 'to Deliver',
    stats: [
      { value: 1, label: 'Late', color: '#dc2626' },
      { value: 2, label: 'waiting', color: colors.gold },
      { value: 6, label: 'operations', color: colors.sage }
    ]
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: "white",
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Navbar />
      <main style={{ padding: '32px' }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <DashboardCard {...receiptData} />
          <DashboardCard {...deliveryData} />
        </div>
      </main>
    </div>
  );
}