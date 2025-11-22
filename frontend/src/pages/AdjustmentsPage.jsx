import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Warehouse, MapPin, ArrowRight, Plus, Trash2, Save, X } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { injectGlobalStyles } from "../styles/colors";
import colors from "../styles/colors";

export default function AdjustmentsPage() {
  useEffect(() => { injectGlobalStyles(); }, []);

  const navigate = useNavigate();
  const [adjustments, setAdjustments] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    fromWarehouse: "",
    toWarehouse: "",
    fromLocation: "",
    toLocation: "",
    reason: ""
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adjustmentsRes, productsRes, warehousesRes, locationsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/adjustments", { headers }),
        axios.get("http://localhost:5000/api/products", { headers }),
        axios.get("http://localhost:5000/api/warehouses", { headers }),
        axios.get("http://localhost:5000/api/locations", { headers })
      ]);

      setAdjustments(adjustmentsRes.data);
      setProducts(productsRes.data);
      setWarehouses(warehousesRes.data);
      setLocations(locationsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.product || !formData.quantity || !formData.fromWarehouse || !formData.toWarehouse) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.fromWarehouse === formData.toWarehouse) {
      alert("Source and destination warehouses must be different");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/adjustments", formData, { headers });
      
      setShowModal(false);
      setFormData({
        product: "",
        quantity: "",
        fromWarehouse: "",
        toWarehouse: "",
        fromLocation: "",
        toLocation: "",
        reason: ""
      });
      fetchData();
    } catch (error) {
      console.error("Error creating adjustment:", error);
      alert(error.response?.data?.message || "Failed to create adjustment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this adjustment?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/adjustments/${id}`, { headers });
      fetchData();
    } catch (error) {
      console.error("Error deleting adjustment:", error);
      alert("Failed to delete adjustment");
    }
  };

  const getFilteredLocations = (warehouseId) => {
    return locations.filter(loc => loc.warehouse._id === warehouseId);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
          <p style={{ color: 'var(--brown)', fontSize: 18 }}>Loading adjustments...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: '32px', minHeight: '100vh', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 32
          }}>
            <div>
              <h1 style={{ 
                fontSize: 32, 
                fontWeight: 700, 
                color: 'var(--brown)',
                margin: 0,
                marginBottom: 8
              }}>
                Stock Adjustments
              </h1>
              <p style={{ color: '#666', margin: 0 }}>
                Transfer stock between warehouses
              </p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Plus size={20} />
              New Adjustment
            </button>
          </div>

          {/* Adjustments List */}
          {adjustments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <Package size={64} color="#ccc" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ color: '#666', marginBottom: 8 }}>No adjustments yet</h3>
              <p style={{ color: '#999', marginBottom: 24 }}>Create your first stock adjustment</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Create Adjustment
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {adjustments.map((adjustment) => (
                <div key={adjustment._id} className="card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <Package size={24} color={colors.brown} />
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.brown }}>
                          {adjustment.product?.name || 'Product'}
                        </h3>
                        <span className="chip" style={{ 
                          backgroundColor: '#E0E7FF', 
                          color: '#3730A3',
                          fontSize: 13,
                          padding: '4px 12px'
                        }}>
                          {adjustment.quantity} units
                        </span>
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr auto 1fr',
                        gap: 24,
                        alignItems: 'center',
                        padding: '16px 0'
                      }}>
                        {/* From */}
                        <div>
                          <div style={{ fontSize: 12, color: '#999', marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>
                            From
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <Warehouse size={18} color={colors.gold} />
                            <span style={{ fontWeight: 600, color: colors.brown }}>
                              {adjustment.fromWarehouse?.name || 'N/A'}
                            </span>
                          </div>
                          {adjustment.fromLocation && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 26 }}>
                              <MapPin size={16} color="#999" />
                              <span style={{ fontSize: 14, color: '#666' }}>
                                {adjustment.fromLocation.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Arrow */}
                        <ArrowRight size={32} color={colors.gold} />

                        {/* To */}
                        <div>
                          <div style={{ fontSize: 12, color: '#999', marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>
                            To
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <Warehouse size={18} color={colors.gold} />
                            <span style={{ fontWeight: 600, color: colors.brown }}>
                              {adjustment.toWarehouse?.name || 'N/A'}
                            </span>
                          </div>
                          {adjustment.toLocation && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 26 }}>
                              <MapPin size={16} color="#999" />
                              <span style={{ fontSize: 14, color: '#666' }}>
                                {adjustment.toLocation.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {adjustment.reason && (
                        <div style={{ 
                          marginTop: 16,
                          padding: 12,
                          background: colors.cream,
                          borderRadius: 8
                        }}>
                          <span style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>Reason: </span>
                          <span style={{ fontSize: 13, color: '#666' }}>{adjustment.reason}</span>
                        </div>
                      )}

                      <div style={{ fontSize: 12, color: '#999', marginTop: 12 }}>
                        {new Date(adjustment.createdAt).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(adjustment._id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: 8
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: 32,
              borderRadius: 12,
              width: '90%',
              maxWidth: 600,
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: colors.brown }}>
                New Stock Adjustment
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <X size={24} color="#999" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="form-label">Product *</label>
                  <select
                    className="form-input"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} (Stock: {p.quantityOnHand})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    min="1"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="form-label">From Warehouse *</label>
                    <select
                      className="form-input"
                      value={formData.fromWarehouse}
                      onChange={(e) => setFormData({ ...formData, fromWarehouse: e.target.value, fromLocation: '' })}
                      required
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map(w => (
                        <option key={w._id} value={w._id}>{w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">To Warehouse *</label>
                    <select
                      className="form-input"
                      value={formData.toWarehouse}
                      onChange={(e) => setFormData({ ...formData, toWarehouse: e.target.value, toLocation: '' })}
                      required
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map(w => (
                        <option key={w._id} value={w._id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="form-label">From Location</label>
                    <select
                      className="form-input"
                      value={formData.fromLocation}
                      onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                      disabled={!formData.fromWarehouse}
                    >
                      <option value="">Select Location</option>
                      {getFilteredLocations(formData.fromWarehouse).map(l => (
                        <option key={l._id} value={l._id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">To Location</label>
                    <select
                      className="form-input"
                      value={formData.toLocation}
                      onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                      disabled={!formData.toWarehouse}
                    >
                      <option value="">Select Location</option>
                      {getFilteredLocations(formData.toWarehouse).map(l => (
                        <option key={l._id} value={l._id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Reason</label>
                  <textarea
                    className="form-input"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    placeholder="Enter reason for adjustment..."
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    <Save size={18} />
                    Create Adjustment
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}