import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2 } from "lucide-react";
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

    try {
      const res = await axios.post("http://localhost:5000/api/receipts", newReceipt, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReceipts();
      setShowNewModal(false);
      setNewReceipt({ supplier: "", toLocation: "WH/Stock1", scheduleDate: "", responsible: "", items: [] });
      // Navigate to the details page
      navigate(`/receipt/${res.data.receipt._id}`);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create receipt");
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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading receipts...</p>
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

      {/* New Receipt Modal */}
      {showNewModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h3>Create New Receipt</h3>
              <button onClick={() => setShowNewModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="profile-field">
                <label className="profile-label">Supplier Name</label>
                <input
                  className="input"
                  value={newReceipt.supplier}
                  onChange={(e) => setNewReceipt({ ...newReceipt, supplier: e.target.value })}
                  placeholder="e.g. Azure Interior"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">To Location</label>
                <input
                  className="input"
                  value={newReceipt.toLocation}
                  onChange={(e) => setNewReceipt({ ...newReceipt, toLocation: e.target.value })}
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Responsible</label>
                <input
                  className="input"
                  value={newReceipt.responsible}
                  onChange={(e) => setNewReceipt({ ...newReceipt, responsible: e.target.value })}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Schedule Date (Optional)</label>
                <input
                  type="date"
                  className="input"
                  value={newReceipt.scheduleDate}
                  onChange={(e) => setNewReceipt({ ...newReceipt, scheduleDate: e.target.value })}
                />
              </div>

              <h4 style={{ marginTop: 20, marginBottom: 12, color: "var(--brown)" }}>Items</h4>
              {newReceipt.items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "end" }}>
                  <div style={{ flex: 1 }}>
                    <label className="profile-label">Product</label>
                    <select
                      className="select"
                      value={item.product}
                      onChange={(e) => updateReceiptItem(idx, "product", e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: 120 }}>
                    <label className="profile-label">Quantity</label>
                    <input
                      type="number"
                      className="input"
                      value={item.quantityExpected}
                      onChange={(e) => updateReceiptItem(idx, "quantityExpected", Number(e.target.value))}
                    />
                  </div>
                  <button className="btn btn-cancel" onClick={() => removeReceiptItem(idx)} style={{ padding: "8px 12px" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addItemToReceipt} style={{ marginTop: 8 }}>
                <Plus size={14} /> Add Item
              </button>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowNewModal(false)} className="btn btn-cancel">
                Cancel
              </button>
              <button onClick={createReceipt} className="btn btn-primary">
                Create Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceiptsPage;