import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2, X, Package, TrendingUp } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { injectGlobalStyles } from "../styles/colors";

const ReceiptsPage = () => {
  useEffect(() => { injectGlobalStyles(); }, []);
  
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newReceipt, setNewReceipt] = useState({
    supplier: "",
    toLocation: "WH/Stock1",
    scheduleDate: "",
    responsible: "",
    items: []
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReceipts();
    fetchProducts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/receipts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReceipts(res.data);
    } catch (error) {
      console.error("Error fetching receipts:", error);
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

  const createReceipt = async () => {
    if (!newReceipt.supplier || newReceipt.items.length === 0) {
      return alert("Supplier and at least one item required");
    }

    // Validate all items have product and quantity
    const invalidItems = newReceipt.items.filter(
      item => !item.product || !item.quantityExpected || item.quantityExpected <= 0
    );

    if (invalidItems.length > 0) {
      return alert("All items must have a product and valid quantity");
    }

    try {
      const payload = {
        supplier: newReceipt.supplier,
        toLocation: newReceipt.toLocation || "WH/Stock1",
        scheduleDate: newReceipt.scheduleDate || new Date().toISOString().split('T')[0],
        responsible: newReceipt.responsible || "",
        items: newReceipt.items.map(item => ({
          product: item.product,
          quantityExpected: Number(item.quantityExpected)
        }))
      };

      console.log("Creating receipt with payload:", payload); // Debug log

      const res = await axios.post("http://localhost:5000/api/receipts", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchReceipts();
      setShowNewModal(false);
      setNewReceipt({ supplier: "", toLocation: "WH/Stock1", scheduleDate: "", responsible: "", items: [] });
      navigate(`/receipt/${res.data.receipt._id}`);
    } catch (error) {
      console.error("Create receipt error:", error.response?.data || error);
      alert(error.response?.data?.error || error.response?.data?.message || "Failed to create receipt");
    }
  };

  const deleteReceipt = async (id) => {
    if (!window.confirm("Delete this receipt?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/receipts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReceipts();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete");
    }
  };

  const addItemToReceipt = () => {
    setNewReceipt({
      ...newReceipt,
      items: [...newReceipt.items, { product: "", quantityExpected: 0 }]
    });
  };

  const updateReceiptItem = (index, field, value) => {
    const updated = [...newReceipt.items];
    updated[index][field] = value;
    setNewReceipt({ ...newReceipt, items: updated });
  };

  const removeReceiptItem = (index) => {
    setNewReceipt({
      ...newReceipt,
      items: newReceipt.items.filter((_, i) => i !== index)
    });
  };

  const filteredReceipts = receipts.filter(
    (r) =>
      r.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
          <p style={{ color: 'var(--brown)' }}>Loading receipts...</p>
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
                Receipts
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
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 40, textAlign: "center", color: "#997644" }}>
                    No receipts found
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((item) => (
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
                      onClick={() => navigate(`/receipt/${item._id}`)}
                    >
                      {item.reference}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>{item.fromLocation}</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>{item.toLocation}</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>{item.supplier}</td>
                    <td style={{ padding: "12px 14px", fontSize: "14px" }}>
                      {item.scheduleDate ? new Date(item.scheduleDate).toLocaleDateString('en-IN') : "-"}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span className="chip" style={{ fontSize: 11, padding: "3px 8px" }}>{item.status}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {item.status !== "DONE" && (
                        <button className="btn btn-cancel" onClick={() => deleteReceipt(item._id)} style={{ fontSize: 12, padding: "6px 10px" }}>
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

      {/* New Receipt Modal - Improved Compact */}
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
              width: 580,
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
              padding: "20px 24px",
              borderBottom: "2px solid var(--cream)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--cream)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <TrendingUp size={20} color="var(--brown)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--brown)" }}>New Receipt</h3>
                  <p style={{ margin: 0, fontSize: 12, color: "#666" }}>Create a new receipt order</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 8,
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.background = "#f0f0f0"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
              >
                <X size={20} color="#666" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* Supplier */}
                <div style={{ gridColumn: "1 / span 2" }}>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block", color: "var(--brown)", fontSize: 13 }}>
                    Supplier <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className="form-input"
                    value={newReceipt.supplier}
                    onChange={(e) => setNewReceipt({ ...newReceipt, supplier: e.target.value })}
                    placeholder="e.g. Azure Interior"
                    style={{ fontSize: 14 }}
                  />
                </div>

                {/* To Location */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block", color: "var(--brown)", fontSize: 13 }}>
                    To Location
                  </label>
                  <input
                    className="form-input"
                    value={newReceipt.toLocation}
                    onChange={(e) => setNewReceipt({ ...newReceipt, toLocation: e.target.value })}
                    style={{ fontSize: 14 }}
                  />
                </div>

                {/* Responsible */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block", color: "var(--brown)", fontSize: 13 }}>
                    Responsible
                  </label>
                  <input
                    className="form-input"
                    value={newReceipt.responsible}
                    onChange={(e) => setNewReceipt({ ...newReceipt, responsible: e.target.value })}
                    placeholder="e.g. John Doe"
                    style={{ fontSize: 14 }}
                  />
                </div>

                {/* Schedule Date */}
                <div style={{ gridColumn: "1 / span 2" }}>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block", color: "var(--brown)", fontSize: 13 }}>
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={newReceipt.scheduleDate}
                    onChange={(e) => setNewReceipt({ ...newReceipt, scheduleDate: e.target.value })}
                    style={{ fontSize: 14 }}
                  />
                </div>
              </div>

              {/* Items Section */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h4 style={{ margin: 0, color: "var(--brown)", fontSize: 14, fontWeight: 600 }}>
                    <Package size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    Items <span style={{ color: "#ef4444" }}>*</span>
                  </h4>
                  <button className="btn btn-secondary" onClick={addItemToReceipt} style={{ fontSize: 12, padding: "5px 10px" }}>
                    <Plus size={13} /> Add
                  </button>
                </div>

                {newReceipt.items.length === 0 ? (
                  <div style={{ padding: 20, textAlign: "center", background: "var(--cream)", borderRadius: 8, color: "#999", fontSize: 13 }}>
                    No items added
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {newReceipt.items.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "end", padding: 10, background: "var(--cream)", borderRadius: 8 }}>
                        <div style={{ flex: 1 }}>
                          <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>Product</label>
                          <select
                            className="form-input"
                            value={item.product}
                            onChange={(e) => updateReceiptItem(idx, "product", e.target.value)}
                            style={{ fontSize: 13, padding: "6px 10px" }}
                          >
                            <option value="">Select Product</option>
                            {products.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ width: 90 }}>
                          <label className="form-label" style={{ fontSize: 11, marginBottom: 4 }}>Qty</label>
                          <input
                            type="number"
                            className="form-input"
                            value={item.quantityExpected}
                            onChange={(e) => updateReceiptItem(idx, "quantityExpected", Number(e.target.value))}
                            style={{ fontSize: 13, padding: "6px 10px" }}
                          />
                        </div>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => removeReceiptItem(idx)} 
                          style={{ padding: "6px 8px", fontSize: 12 }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: "14px 24px",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: 10,
              background: "#fafafa"
            }}>
              <button 
                onClick={() => setShowNewModal(false)} 
                className="btn btn-secondary"
                style={{ flex: 1, padding: "8px 16px", fontSize: 14 }}
              >
                Cancel
              </button>
              <button 
                onClick={createReceipt} 
                className="btn btn-primary"
                style={{ flex: 1, padding: "8px 16px", fontSize: 14 }}
              >
                <Plus size={15} /> Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceiptsPage;