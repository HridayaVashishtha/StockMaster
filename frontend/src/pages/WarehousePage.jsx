import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Edit2, Trash2, Building } from 'lucide-react';
import Navbar from "../components/Navbar";
import axios from 'axios';
import { injectGlobalStyles } from '../styles/colors';

const WarehousePage = () => {
  useEffect(() => { injectGlobalStyles(); }, []);

  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    address: ''
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/warehouses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWarehouses(res.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.shortCode) {
      return alert("Name and Short Code are required");
    }

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/warehouses/${currentId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Warehouse updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/warehouses", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Warehouse created successfully");
      }
      
      fetchWarehouses();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save warehouse");
    }
  };

  const handleEdit = (warehouse) => {
    setFormData({
      name: warehouse.name,
      shortCode: warehouse.shortCode,
      address: warehouse.address || ''
    });
    setCurrentId(warehouse._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this warehouse?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/warehouses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Warehouse deleted");
      fetchWarehouses();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({ name: '', shortCode: '', address: '' });
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
  };

  return (
    <>
      <Navbar />
      <main style={{ padding: '32px', minHeight: '100vh', background: 'var(--cream)' }}>
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: 'var(--brown)', fontSize: 24, fontWeight: 700, margin: 0 }}>
              Warehouses
            </h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate("/location")}
              >
                <MapPin size={16} /> Manage Locations
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowModal(true)}
              >
                <Plus size={16} /> New Warehouse
              </button>
            </div>
          </div>

          {warehouses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <Building size={48} color="#ccc" style={{ marginBottom: 16 }} />
              <p>No warehouses found. Create your first warehouse!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {warehouses.map((wh) => (
                <div 
                  key={wh._id}
                  className="card"
                  style={{ 
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--brown)', margin: 0, marginBottom: 4 }}>
                        {wh.name}
                      </h3>
                      <span className="chip" style={{ fontSize: 11, padding: '3px 8px' }}>
                        {wh.shortCode}
                      </span>
                    </div>
                    <Building size={32} color="var(--brown)" style={{ opacity: 0.3 }} />
                  </div>

                  {wh.address && (
                    <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
                      📍 {wh.address}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--cream)' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleEdit(wh)}
                      style={{ flex: 1, fontSize: 12, padding: '6px 12px' }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      className="btn btn-cancel" 
                      onClick={() => handleDelete(wh._id)}
                      style={{ fontSize: 12, padding: '6px 12px' }}
                    >
                      <Trash2 size={14} />
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
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3>{editMode ? 'Edit Warehouse' : 'New Warehouse'}</h3>
              <button onClick={resetForm} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="profile-field">
                <label className="profile-label">Warehouse Name *</label>
                <input
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Main Warehouse"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Short Code *</label>
                <input
                  className="input"
                  value={formData.shortCode}
                  onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                  placeholder="e.g. WH01"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Address</label>
                <input
                  className="input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 123 Main St, Mumbai"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={resetForm} className="btn btn-cancel">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn btn-primary">
                {editMode ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WarehousePage;
