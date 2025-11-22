import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2, X, Package, Truck } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { injectGlobalStyles } from "../styles/colors";

const DeliveryPage = () => {
  useEffect(() => { injectGlobalStyles(); }, []);
  
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    customer: "",
    fromLocation: "WH/Stock1",
    deliveryAddress: "",
    scheduleDate: "",
    responsible: "",
    operationType: "DELIVERY",
    items: []
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDeliveries();
    fetchProducts();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/deliveries", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeliveries(res.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const createDelivery = async () => {
    if (!newDelivery.customer || newDelivery.items.length === 0) {
      return alert("Customer and at least one item required");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/deliveries", newDelivery, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDeliveries();
      setShowNewModal(false);
      setNewDelivery({ 
        customer: "", 
        fromLocation: "WH/Stock1", 
        deliveryAddress: "",
        scheduleDate: "", 
        responsible: "", 
        operationType: "DELIVERY",
        items: [] 
      });
      navigate(`/delivery/${res.data.delivery._id}`);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create delivery");
    }
  };

  const deleteDelivery = async (id) => {
    if (!window.confirm("Delete this delivery?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/deliveries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDeliveries();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete");
    }
  };

  const addItemToDelivery = () => {
    setNewDelivery({
      ...newDelivery,
      items: [...newDelivery.items, { product: "", quantityOrdered: 0 }]
    });
  };

  const updateDeliveryItem = (index, field, value) => {
    const updated = [...newDelivery.items];
    updated[index][field] = value;
    setNewDelivery({ ...newDelivery, items: updated });
  };

  const removeDeliveryItem = (index) => {
    setNewDelivery({
      ...newDelivery,
      items: newDelivery.items.filter((_, i) => i !== index)
    });
  };

  const filteredDeliveries = deliveries.filter(
    (d) =>
      d.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
          <p style={{ color: 'var(--brown)' }}>Loading deliveries...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ padding: "32px", minHeight: "100vh", background: "var(--cream)" }}>
        <div className="card" style={{ marginBottom: 24 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
                <Plus size={16} /> NEW
              </button>
              <h2 style={{ color: "var(--brown)", fontSize: "20px", fontWeight: "600", margin: 0 }}>
                Delivery Orders
              </h2>
            </div>

            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--brown)" }} />
                <input
                  className="input"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: 40, width: 240 }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--brown)" }}>
              <tr>
                {["Reference", "From", "To", "Contact", "Schedule Date", "Status", "Actions"].map((header) => (
                  <th key={header} style={{ textAlign: "left", padding: "12px 14px", color: "white", fontWeight: "600", fontSize: "13px", textTransform: "uppercase" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 40, textAlign: "center", color: "#997644" }}>
                    No delivery orders found
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid var(--cream)" }}>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "var(--brown)",
                        fontSize: "14px",
                        fontStyle: "italic",
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: "600"
                      }}
                      onClick={() => navigate(`/delivery/${item._id}`)}
                    >
                      {item.reference}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>{item.fromLocation}</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>{item.toLocation}</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>{item.customer}</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>
                      {item.scheduleDate ? new Date(item.scheduleDate).toLocaleDateString('en-IN') : "-"}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span className="chip" style={{ fontSize: 11, padding: "3px 8px" }}>{item.status}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {item.status !== "DONE" && (
                        <button className="btn btn-cancel" onClick={() => deleteDelivery(item._id)} style={{ fontSize: 12, padding: "6px 10px" }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* New Delivery Modal - Improved */}
      {showNewModal && (
        <div
          onClick={() => setShowNewModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            backdropFilter: "blur(4px)"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              width: 700,
              maxWidth: "94vw",
              maxHeight: "90vh",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* Header */}
            <div style={{
              padding: "24px 28px",
              borderBottom: "2px solid var(--cream)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--cream)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Truck size={24} color="var(--brown)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--brown)" }}>New Delivery Order</h3>
                  <p style={{ margin: 0, fontSize: 13, color: "#666" }}>Create a new delivery order</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  borderRadius: 8,
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.background = "#f0f0f0"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
              >
                <X size={24} color="#666" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Customer */}
                <div style={{ gridColumn: "1 / span 2" }}>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block", color: "var(--brown)" }}>
                    Customer Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className="form-input"
                    value={newDelivery.customer}
                    onChange={(e) => setNewDelivery({ ...newDelivery, customer: e.target.value })}
                    placeholder="e.g. Azure Interior"
                  />
                </div>

                {/* From Location */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block", color: "var(--brown)" }}>
                    From Location
                  </label>
                  <input
                    className="form-input"
                    value={newDelivery.fromLocation}
                    onChange={(e) => setNewDelivery({ ...newDelivery, fromLocation: e.target.value })}
                  />
                </div>

                {/* Operation Type */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block", color: "var(--brown)" }}>
                    Operation Type
                  </label>
                  <select
                    className="form-input"
                    value={newDelivery.operationType}
                    onChange={(e) => setNewDelivery({ ...newDelivery, operationType: e.target.value })}
                  >
                    <option value="DELIVERY">Delivery</option>
                    <option value="PICKUP">Pickup</option>
                    <option value="RETURN">Return</option>
                  </select>
                </div>

                {/* Delivery Address */}
                <div style={{ gridColumn: "1 / span 2" }}>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block", color: "var(--brown)" }}>
                    Delivery Address
                  </label>
                  <input
                    className="form-input"
                    value={newDelivery.deliveryAddress}
                    onChange={(e) => setNewDelivery({ ...newDelivery, deliveryAddress: e.target.value })}
                    placeholder="e.g. 123 Main St, Mumbai"
                  />
                </div>

                {/* Responsible */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block", color: "var(--brown)" }}>
                    Responsible
                  </label>
                  <input
                    className="form-input"
                    value={newDelivery.responsible}
                    onChange={(e) => setNewDelivery({ ...newDelivery, responsible: e.target.value })}
                    placeholder="e.g. John Doe"
                  />
                </div>

                {/* Schedule Date */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block", color: "var(--brown)" }}>
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={newDelivery.scheduleDate}
                    onChange={(e) => setNewDelivery({ ...newDelivery, scheduleDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Items Section */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h4 style={{ margin: 0, color: "var(--brown)", fontSize: 16, fontWeight: 600 }}>
                    <Package size={18} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    Items <span style={{ color: "#ef4444" }}>*</span>
                  </h4>
                  <button className="btn btn-secondary" onClick={addItemToDelivery} style={{ fontSize: 13, padding: "6px 12px" }}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                {newDelivery.items.length === 0 ? (
                  <div style={{ padding: 24, textAlign: "center", background: "var(--cream)", borderRadius: 8, color: "#999" }}>
                    No items added yet
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {newDelivery.items.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 10, alignItems: "end", padding: 12, background: "var(--cream)", borderRadius: 8 }}>
                        <div style={{ flex: 1 }}>
                          <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>Product</label>
                          <select
                            className="form-input"
                            value={item.product}
                            onChange={(e) => updateDeliveryItem(idx, "product", e.target.value)}
                            style={{ fontSize: 14 }}
                          >
                            <option value="">Select Product</option>
                            {products.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name} (Available: {p.freeToUse})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ width: 100 }}>
                          <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>Quantity</label>
                          <input
                            type="number"
                            className="form-input"
                            value={item.quantityOrdered}
                            onChange={(e) => updateDeliveryItem(idx, "quantityOrdered", Number(e.target.value))}
                            style={{ fontSize: 14 }}
                          />
                        </div>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => removeDeliveryItem(idx)} 
                          style={{ padding: "8px 10px", fontSize: 13 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: "16px 28px",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: 12,
              background: "#fafafa"
            }}>
              <button 
                onClick={() => setShowNewModal(false)} 
                className="btn btn-secondary"
                style={{ flex: 1, padding: "10px 20px" }}
              >
                Cancel
              </button>
              <button 
                onClick={createDelivery} 
                className="btn btn-primary"
                style={{ flex: 1, padding: "10px 20px" }}
              >
                <Plus size={16} /> Create Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryPage;