import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Eye, X, Package } from "lucide-react";
import { injectGlobalStyles } from "../styles/colors";

export default function ProductsPage() {
  useEffect(() => { injectGlobalStyles(); }, []);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    costPerUnit: 0,
    onHand: 0,
    freeToUse: "",
    category: "General",
    unit: "pcs",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products", { headers });
      setProducts(data);
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error(e);
        alert("Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name.trim(),
        costPerUnit: Number(form.costPerUnit) || 0,
        onHand: Number(form.onHand) || 0,
        freeToUse: form.freeToUse === "" ? Number(form.onHand) || 0 : Number(form.freeToUse),
        category: form.category || "General",
        unit: form.unit || "pcs",
      };
      if (form.sku.trim()) payload.sku = form.sku.trim();

      await axios.post("http://localhost:5000/api/products", payload, { headers });
      setShowAdd(false);
      setForm({ name: "", sku: "", costPerUnit: 0, onHand: 0, freeToUse: "", category: "General", unit: "pcs" });
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.error || "Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, { headers });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.error || "Failed to delete");
    }
  };

  const filtered = products.filter(p =>
    [p.name, p.sku, p.category].filter(Boolean).some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)" }}>
          <p style={{ color: "var(--brown)", fontSize: 18 }}>Loading products...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: 32, background: "var(--cream)", minHeight: "100vh" }}>
        <div className="card" style={{ marginBottom: 24, padding: "24px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div>
              <h1 style={{ margin: 0, marginBottom: 4, fontSize: 28, fontWeight: 700, color: "var(--brown)" }}>Products</h1>
              <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{products.length} items in inventory</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input
                className="form-input"
                placeholder="Search by name, SKU, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: 320 }}
              />
              <button className="btn btn-primary" onClick={() => setShowAdd(true)} style={{ whiteSpace: "nowrap" }}>
                <Plus size={20} /> Add Product
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ overflow: "auto", padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--cream)", borderBottom: "2px solid var(--brown)" }}>
                <th style={{ textAlign: "left", padding: "16px 12px", fontWeight: 700, color: "var(--brown)" }}>Name</th>
                <th style={{ textAlign: "left", padding: "16px 12px", fontWeight: 700, color: "var(--brown)" }}>SKU</th>
                <th style={{ textAlign: "right", padding: "16px 12px", fontWeight: 700, color: "var(--brown)" }}>On Hand</th>
                <th style={{ textAlign: "right", padding: "16px 12px", fontWeight: 700, color: "var(--brown)" }}>Free</th>
                <th style={{ textAlign: "right", padding: "16px 12px", fontWeight: 700, color: "var(--brown)" }}>Cost/Unit</th>
                <th style={{ textAlign: "left", padding: "16px 12px", fontWeight: 700, color: "var(--brown)" }}>Category</th>
                <th style={{ textAlign: "left", padding: "16px 12px", fontWeight: 700, color: "var(--brown)" }}>Unit</th>
                <th style={{ textAlign: "right", padding: "16px 12px", fontWeight: 700, color: "var(--brown)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 48, color: "#999" }}>
                    <Package size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                    <div>No products found</div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} style={{ borderTop: "1px solid #eee", transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
                    <td style={{ padding: "14px 12px", fontWeight: 600, color: "var(--brown)" }}>{p.name}</td>
                    <td style={{ padding: "14px 12px", color: "#666" }}>{p.sku || "-"}</td>
                    <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 600 }}>{p.onHand}</td>
                    <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 600 }}>{p.freeToUse}</td>
                    <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 600 }}>₹{(p.costPerUnit || 0).toLocaleString("en-IN")}</td>
                    <td style={{ padding: "14px 12px" }}>{p.category || "-"}</td>
                    <td style={{ padding: "14px 12px" }}>{p.unit || "pcs"}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right" }}>
                      <button className="btn btn-secondary" onClick={() => navigate(`/product/${p._id}`)} style={{ marginRight: 8, fontSize: 13, padding: "6px 12px" }}>
                        <Eye size={14} /> View
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(p._id)} style={{ fontSize: 13, padding: "6px 12px" }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showAdd && (
        <div
          onClick={() => setShowAdd(false)}
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
              width: 640,
              maxWidth: "94vw",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}
          >
            {/* Header */}
            <div style={{
              padding: "24px 32px",
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
                  <Package size={24} color="var(--brown)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--brown)" }}>Add New Product</h3>
                  <p style={{ margin: 0, fontSize: 13, color: "#666" }}>Fill in the details below</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdd(false)}
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

            {/* Form */}
            <form onSubmit={handleAdd} style={{ padding: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Product Name */}
                <div style={{ gridColumn: "1 / span 2" }}>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: "block", color: "var(--brown)" }}>
                    Product Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className="form-input"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ fontSize: 15 }}
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: "block", color: "var(--brown)" }}>
                    SKU / Code
                  </label>
                  <input
                    className="form-input"
                    placeholder="e.g. PROD-001"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    style={{ fontSize: 15 }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: "block", color: "var(--brown)" }}>
                    Category
                  </label>
                  <input
                    className="form-input"
                    placeholder="e.g. Electronics"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ fontSize: 15 }}
                  />
                </div>

                {/* Cost per Unit */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: "block", color: "var(--brown)" }}>
                    Cost per Unit (₹)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0.00"
                    value={form.costPerUnit}
                    onChange={(e) => setForm({ ...form, costPerUnit: e.target.value })}
                    min="0"
                    step="0.01"
                    style={{ fontSize: 15 }}
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: "block", color: "var(--brown)" }}>
                    Unit of Measure
                  </label>
                  <select
                    className="form-input"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    style={{ fontSize: 15 }}
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="boxes">Boxes</option>
                    <option value="units">Units</option>
                    <option value="liters">Liters</option>
                  </select>
                </div>

                {/* On Hand */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: "block", color: "var(--brown)" }}>
                    Quantity On Hand
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={form.onHand}
                    onChange={(e) => setForm({ ...form, onHand: e.target.value })}
                    min="0"
                    style={{ fontSize: 15 }}
                  />
                </div>

                {/* Free to Use */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: "block", color: "var(--brown)" }}>
                    Free to Use
                    <span style={{ fontSize: 12, fontWeight: 400, color: "#999", marginLeft: 6 }}>(optional)</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Same as on hand"
                    value={form.freeToUse}
                    onChange={(e) => setForm({ ...form, freeToUse: e.target.value })}
                    min="0"
                    style={{ fontSize: 15 }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 12, marginTop: 32, paddingTop: 24, borderTop: "1px solid #eee" }}>
                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{ flex: 1, padding: "12px 24px", fontSize: 15, fontWeight: 600 }}
                >
                  <Plus size={18} /> Add Product
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setShowAdd(false)}
                  style={{ flex: 1, padding: "12px 24px", fontSize: 15, fontWeight: 600 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}