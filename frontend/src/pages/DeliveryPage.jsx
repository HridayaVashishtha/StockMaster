import React, { useState } from "react";
import Navbar from "../components/Navbar";

const colors = {
  sage: "#B6CBBD",
  brown: "#754E1A",
  gold: "#CBA35C",
  cream: "#F8E1B7",
};

const DeliveryPage = () => {
  const [deliveries, setDeliveries] = useState([
    { id: 1, reference: "WH/OUT/0001", from: "WH/Stock1", to: "Customer", contact: "Azure Interior", scheduleDate: "", status: "Ready" },
    { id: 2, reference: "WH/OUT/0002", from: "WH/Stock1", to: "Customer", contact: "Azure Interior", scheduleDate: "", status: "Ready" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredDeliveries = deliveries.filter(
    (d) =>
      d.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const IconButton = ({ children, color = colors.brown }) => (
    <button
      style={{
        backgroundColor: "transparent",
        border: `2px solid ${color}`,
        borderRadius: "6px",
        padding: "6px 10px",
        cursor: "pointer",
        color: color,
        fontSize: "14px",
      }}
    >
      {children}
    </button>
  );

  return (
    <>
      <Navbar />

      <main style={{ padding: "32px" }}>
        <div
          style={{
            backgroundColor: "white",
            border: `2px solid ${colors.brown}`,
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(117, 78, 26, 0.15)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              borderBottom: `2px solid ${colors.sage}`,
              paddingBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                style={{
                  backgroundColor: colors.gold,
                  color: colors.brown,
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                NEW
              </button>
              <h2
                style={{
                  color: colors.brown,
                  fontSize: "20px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                Delivery
              </h2>
            </div>

            {/* Search + Icons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "8px 36px 8px 12px",
                    border: `1px solid ${colors.brown}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.brown,
                  }}
                >
                  🔍
                </span>
              </div>

              <IconButton>☰</IconButton>
              <IconButton color="#dc2626">🗑</IconButton>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.brown}` }}>
                {["Reference", "From", "To", "Contact", "Schedule Date", "Status"].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "12px 8px",
                      color: colors.brown,
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredDeliveries.map((item) => (
                <tr key={item.id} style={{ borderBottom: `1px dashed ${colors.sage}` }}>
                  <td style={{ padding: "12px 8px", color: colors.brown, fontSize: "14px", fontStyle: "italic" }}>
                    {item.reference}
                  </td>
                  <td style={{ padding: "12px 8px", color: colors.brown, fontSize: "14px" }}>{item.from}</td>
                  <td style={{ padding: "12px 8px", color: colors.brown, fontSize: "14px" }}>{item.to}</td>
                  <td style={{ padding: "12px 8px", color: colors.brown, fontSize: "14px" }}>{item.contact}</td>
                  <td style={{ padding: "12px 8px", color: colors.brown, fontSize: "14px" }}>
                    {item.scheduleDate || "-"}
                  </td>
                  <td style={{ padding: "12px 8px", color: colors.brown, fontSize: "14px", fontWeight: "500" }}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              backgroundColor: colors.cream,
              borderRadius: "8px",
              textAlign: "center",
              color: colors.brown,
              fontSize: "14px",
            }}
          >
            Populate all work orders added to manufacturing order
            <br />
            <span style={{ fontSize: "12px", color: colors.gold }}>Locations of warehouse: WH/Stock1</span>
          </div>
        </div>
      </main>
    </>
  );
};

export default DeliveryPage;
