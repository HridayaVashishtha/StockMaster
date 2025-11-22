import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Printer, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { injectGlobalStyles } from '../styles/colors';

export default function ReceiptDetails() {
  useEffect(() => { injectGlobalStyles(); }, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      fetchReceipt();
    }
    fetchProducts();
  }, [id]);

  const fetchReceipt = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/receipts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReceipt(res.data);
      setEditMode(res.data.status === "DRAFT" || res.data.status === "WAITING");
    } catch (error) {
      console.error("Error fetching receipt:", error);
      alert("Failed to load receipt");
      navigate("/receipts");
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

  const updateReceipt = async () => {
    try {
      await axios.put(`http://localhost:5000/api/receipts/${id}`, receipt, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Receipt updated successfully");
      fetchReceipt();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update receipt");
    }
  };

  const validateReceipt = async () => {
    if (!window.confirm("Validate this receipt? This will update stock quantities.")) return;
    try {
      await axios.post(`http://localhost:5000/api/receipts/${id}/validate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Receipt validated and stock updated!");
      fetchReceipt();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to validate receipt");
    }
  };

  const cancelReceipt = async () => {
    if (!window.confirm("Cancel this receipt?")) return;
    try {
      await axios.post(`http://localhost:5000/api/receipts/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Receipt cancelled");
      fetchReceipt();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to cancel receipt");
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/receipts/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReceipt();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update status");
    }
  };

  const addNewProduct = () => {
    setReceipt({
      ...receipt,
      items: [...receipt.items, { product: null, quantityExpected: 0, quantityReceived: 0 }]
    });
  };

  const updateItem = (index, field, value) => {
    const updated = [...receipt.items];
    updated[index][field] = value;
    setReceipt({ ...receipt, items: updated });
  };

  const removeItem = (index) => {
    setReceipt({
      ...receipt,
      items: receipt.items.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading receipt...</p>
        </div>
      </>
    );
  }

  if (!receipt) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Receipt not found</p>
        </div>
      </>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return { bg: '#FEF3C7', color: '#92400E', border: '#F59E0B' };
      case 'WAITING': return { bg: '#E0E7FF', color: '#3730A3', border: '#6366F1' };
      case 'READY': return { bg: '#DBEAFE', color: '#1E40AF', border: '#3B82F6' };
      case 'DONE': return { bg: '#D1FAE5', color: '#065F46', border: '#10B981' };
      case 'CANCELLED': return { bg: '#FEE2E2', color: '#991B1B', border: '#EF4444' };
      default: return { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' };
    }
  };

  const statusColors = getStatusColor(receipt.status);

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '40px' }}>
        <div className="container" style={{ maxWidth: 1400 }}>
          {/* Header */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--brown)', margin: 0 }}>Receipt</h1>
              <button className="btn btn-primary" onClick={() => navigate("/receipts/new")}>
                New
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {receipt.status !== "DONE" && receipt.status !== "CANCELLED" && (
                  <>
                    <button className="btn btn-primary" onClick={validateReceipt}>
                      Validate
                    </button>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                      <Printer size={16} /> Print
                    </button>
                    <button className="btn btn-cancel" onClick={cancelReceipt}>
                      <X size={16} /> Cancel
                    </button>
                  </>
                )}
              </div>

              {/* Status Flow */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {['DRAFT', 'READY', 'DONE'].map((status, idx) => (
                  <React.Fragment key={status}>
                    <span
                      style={{
                        padding: '8px 20px',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: receipt.status !== 'DONE' && receipt.status !== 'CANCELLED' ? 'pointer' : 'default',
                        backgroundColor: getStatusColor(status).bg,
                        color: getStatusColor(status).color,
                        border: `2px solid ${getStatusColor(status).border}`,
                        opacity: receipt.status === status ? 1 : 0.5
                      }}
                      onClick={() => {
                        if (receipt.status !== 'DONE' && receipt.status !== 'CANCELLED') {
                          updateStatus(status);
                        }
                      }}
                    >
                      {status}
                    </span>
                    {idx < 2 && <span style={{ color: 'var(--brown)', fontSize: 18 }}>{'>'}</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="card">
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--brown)', marginBottom: 32 }}>
              {receipt.reference}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 32 }}>
              <div className="profile-field">
                <label className="profile-label">Receive From</label>
                <input
                  className="input"
                  value={receipt.supplier}
                  onChange={(e) => setReceipt({ ...receipt, supplier: e.target.value })}
                  disabled={!editMode}
                />
              </div>

              <div className="profile-field">
                <label className="profile-label">Schedule Date</label>
                <input
                  type="date"
                  className="input"
                  value={receipt.scheduleDate ? new Date(receipt.scheduleDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setReceipt({ ...receipt, scheduleDate: e.target.value })}
                  disabled={!editMode}
                />
              </div>

              <div className="profile-field">
                <label className="profile-label">Responsible</label>
                <input
                  className="input"
                  value={receipt.responsible || ''}
                  onChange={(e) => setReceipt({ ...receipt, responsible: e.target.value })}
                  disabled={!editMode}
                />
              </div>

              <div className="profile-field">
                <label className="profile-label">To Location</label>
                <input
                  className="input"
                  value={receipt.toLocation}
                  onChange={(e) => setReceipt({ ...receipt, toLocation: e.target.value })}
                  disabled={!editMode}
                />
              </div>
            </div>

            {/* Products Section */}
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--brown)', marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid var(--brown)' }}>
              Products
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
              <thead style={{ background: 'var(--brown)' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontWeight: 600, fontSize: 14 }}>
                    Product
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontWeight: 600, fontSize: 14 }}>
                    Quantity Expected
                  </th>
                  {receipt.status === 'DONE' && (
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontWeight: 600, fontSize: 14 }}>
                      Quantity Received
                    </th>
                  )}
                  {editMode && (
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontWeight: 600, fontSize: 14 }}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--cream)' }}>
                    <td style={{ padding: '16px', color: 'var(--brown)', fontWeight: 500 }}>
                      {editMode ? (
                        <select
                          className="select"
                          value={item.product?._id || ''}
                          onChange={(e) => updateItem(idx, 'product', e.target.value)}
                        >
                          <option value="">Select Product</option>
                          {products.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                          ))}
                        </select>
                      ) : (
                        item.product?.name || '-'
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <input
                        type="number"
                        className="input"
                        value={item.quantityExpected}
                        onChange={(e) => updateItem(idx, 'quantityExpected', Number(e.target.value))}
                        disabled={!editMode}
                        style={{ width: 100, textAlign: 'center' }}
                      />
                    </td>
                    {receipt.status === 'DONE' && (
                      <td style={{ padding: '16px', fontWeight: 600, color: '#10b981' }}>
                        {item.quantityReceived} {item.product?.unit}
                      </td>
                    )}
                    {editMode && (
                      <td style={{ padding: '16px' }}>
                        <button className="btn btn-cancel" onClick={() => removeItem(idx)} style={{ padding: '6px 10px' }}>
                          <X size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {editMode && (
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-secondary" onClick={addNewProduct}>
                  <Plus size={18} /> New Product
                </button>
                <button className="btn btn-primary" onClick={updateReceipt}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}