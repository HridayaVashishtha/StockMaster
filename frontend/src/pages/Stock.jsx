import React, { useState, useEffect } from "react";
import { Plus, Edit2, Save, X, History, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { injectGlobalStyles } from "../styles/colors";

export default function Stock() {
  useEffect(() => { injectGlobalStyles(); }, []);

  const [stock, setStock] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    costPerUnit: 0,
    onHand: 0,
    freeToUse: 0,
    category: "General",
    unit: "pcs"
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addStockQuantity, setAddStockQuantity] = useState(0);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "InventoryManager";

  // Fetch stock when page loads
  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("📦 Stock received:", res.data.length, "products"); // Debug log
      console.log("First product:", res.data[0]); // Debug log
      setStock(res.data);
    } catch (error) {
      console.error("Error fetching stock:", error);
      
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
      
      alert(error.response?.data?.error || "Failed to fetch stock");
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id, updatedItem) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, updatedItem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStock();
      setEditingId(null);
      alert("Stock updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      alert(error.response?.data?.error || "Failed to update stock");
    }
  };

  const createProduct = async () => {
    if (!newProduct.name.trim()) return alert("Product name required");
    try {
      await axios.post("http://localhost:5000/api/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStock();
      setShowAddModal(false);
      setNewProduct({ name: "", costPerUnit: 0, onHand: 0, freeToUse: 0, category: "General", unit: "pcs" });
      alert("Product created successfully");
    } catch (error) {
      console.error("Create failed:", error);
      alert(error.response?.data?.error || "Failed to create product");
    }
  };

  const addStockToProduct = async () => {
    if (!selectedProduct || addStockQuantity <= 0) {
      return alert("Please enter a valid quantity");
    }

    try {
      await axios.post(
        `http://localhost:5000/api/products/${selectedProduct._id}/add-stock`,
        { quantity: addStockQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchStock();
      setShowAddStockModal(false);
      setSelectedProduct(null);
      setAddStockQuantity(0);
      alert("Stock added successfully");
    } catch (error) {
      console.error("Add stock failed:", error);
      alert(error.response?.data?.error || "Failed to add stock");
    }
  };

  const handleEditClick = (item) => {
    if (editingId === item._id) {
      updateStock(item._id, item);
    } else {
      setEditingId(item._id);
    }
  };

  const handleFieldChange = (id, field, value) => {
    setStock(
      stock.map((item) =>
        item._id === id ? { ...item, [field]: field === 'name' ? value : Number(value) || 0 } : item
      )
    );
  };

  const filteredStock = stock.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = stock.filter(item => item.onHand < 10).length;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <p>Loading stock...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <Navbar />

      <main className="container" style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontWeight: 800, color: "var(--brown)", margin: "0 0 8px" }}>Stock Management</h2>
            <p style={{ color: "#997644", margin: 0, fontSize: 14 }}>
              {stock.length} products • {lowStockItems > 0 && `${lowStockItems} low stock alerts`}
            </p>
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Add Product
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center" }}>
          <input
            className="input"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, maxWidth: 360 }}
          />
        </div>

        <div className="card" style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--brown)" }}>
                {["Product", "Per Unit Cost", "On Hand", "Free to Use", "Category", "Unit"].map((header) => (
                  <th key={header} style={{ padding: "12px 10px", fontWeight: 700, textAlign: "left", fontSize: 13, color: "var(--brown)", textTransform: "uppercase", letterSpacing: ".5px" }}>
                    {header}
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredStock.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 40, textAlign: "center", color: "#997644" }}>
                    No products found
                  </td>
                </tr>
              ) : (
                filteredStock.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid var(--cream)" }}>
                    <td style={{ padding: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {item.onHand < 10 && <AlertCircle size={14} color="#dc2626" />}
                        {editingId === item._id ? (
                          <input
                            value={item.name}
                            onChange={(e) => handleFieldChange(item._id, "name", e.target.value)}
                            className="input"
                            style={{ width: 140 }}
                          />
                        ) : (
                          <span style={{ fontWeight: 600 }}>{item.name}</span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: 10 }}>
                      {editingId === item._id ? (
                        <input
                          type="number"
                          value={item.costPerUnit}
                          onChange={(e) => handleFieldChange(item._id, "costPerUnit", e.target.value)}
                          className="input"
                          style={{ width: 90 }}
                        />
                      ) : (
                        `₹${item.costPerUnit}`
                      )}
                    </td>

                    <td style={{ padding: 10 }}>
                      {editingId === item._id ? (
                        <input
                          type="number"
                          value={item.onHand}
                          onChange={(e) => handleFieldChange(item._id, "onHand", e.target.value)}
                          className="input"
                          style={{ width: 80 }}
                        />
                      ) : (
                        <span style={{ color: item.onHand < 10 ? "#dc2626" : "inherit" }}>{item.onHand}</span>
                      )}
                    </td>

                    <td style={{ padding: 10 }}>
                      {editingId === item._id ? (
                        <input
                          type="number"
                          value={item.freeToUse}
                          onChange={(e) => handleFieldChange(item._id, "freeToUse", e.target.value)}
                          className="input"
                          style={{ width: 80 }}
                        />
                      ) : (
                        item.freeToUse
                      )}
                    </td>

                    <td style={{ padding: 10 }}>{item.category}</td>
                    <td style={{ padding: 10 }}>{item.unit}</td>

                    <td style={{ padding: 10 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className={editingId === item._id ? "btn btn-primary" : "btn btn-secondary"}
                          onClick={() => handleEditClick(item)}
                          style={{ fontSize: 12, padding: "8px 12px" }}
                        >
                          {editingId === item._id ? <><Save size={14} /> Save</> : <><Edit2 size={14} /> Edit</>}
                        </button>
                        
                        {/* New: Add Stock button */}
                        {editingId !== item._id && (
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowAddStockModal(true);
                            }}
                            style={{ fontSize: 12, padding: "8px 12px" }}
                          >
                            <Plus size={14} /> Add Stock
                          </button>
                        )}

                        {editingId === item._id && (
                          <button
                            className="btn btn-cancel"
                            onClick={() => { setEditingId(null); fetchStock(); }}
                            style={{ fontSize: 12, padding: "8px 12px" }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="profile-field">
                <label className="profile-label">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="input"
                  placeholder="e.g. Desk"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Cost Per Unit (₹)</label>
                <input
                  type="number"
                  value={newProduct.costPerUnit}
                  onChange={(e) => setNewProduct({ ...newProduct, costPerUnit: Number(e.target.value) })}
                  className="input"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Initial On Hand</label>
                <input
                  type="number"
                  value={newProduct.onHand}
                  onChange={(e) => setNewProduct({ ...newProduct, onHand: Number(e.target.value) })}
                  className="input"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Free to Use</label>
                <input
                  type="number"
                  value={newProduct.freeToUse}
                  onChange={(e) => setNewProduct({ ...newProduct, freeToUse: Number(e.target.value) })}
                  className="input"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Category</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="input"
                  placeholder="e.g. Furniture"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Unit</label>
                <select
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  className="select"
                >
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="liters">Liters</option>
                  <option value="boxes">Boxes</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAddModal(false)} className="btn btn-cancel">Cancel</button>
              <button onClick={createProduct} className="btn btn-primary">Create Product</button>
            </div>
          </div>
        </div>
      )}

      {/* New: Add Stock Modal */}
      {showAddStockModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Stock: {selectedProduct.name}</h3>
              <button onClick={() => {
                setShowAddStockModal(false);
                setSelectedProduct(null);
                setAddStockQuantity(0);
              }} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="profile-field">
                <label className="profile-label">Current Stock</label>
                <p className="profile-value">{selectedProduct.onHand} {selectedProduct.unit}</p>
              </div>
              <div className="profile-field">
                <label className="profile-label">Quantity to Add</label>
                <input
                  type="number"
                  min="1"
                  value={addStockQuantity}
                  onChange={(e) => setAddStockQuantity(Number(e.target.value))}
                  className="input"
                  placeholder="Enter quantity to add"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">New Total</label>
                <p className="profile-value" style={{ fontWeight: 700, color: "var(--brown)" }}>
                  {selectedProduct.onHand + addStockQuantity} {selectedProduct.unit}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => {
                setShowAddStockModal(false);
                setSelectedProduct(null);
                setAddStockQuantity(0);
              }} className="btn btn-cancel">Cancel</button>
              <button onClick={addStockToProduct} className="btn btn-primary">
                <Plus size={16} /> Add Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
