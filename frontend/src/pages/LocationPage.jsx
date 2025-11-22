import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import Navbar from "../components/Navbar";
import axios from 'axios';
import { injectGlobalStyles } from '../styles/colors';

const LocationPage = () => {
  useEffect(() => { injectGlobalStyles(); }, []);

  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    warehouse: ''
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLocations();
    fetchWarehouses();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/locations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLocations(res.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

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
    if (!formData.name || !formData.shortCode || !formData.warehouse) {
      return alert("All fields are required");
    }

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/locations/${currentId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Location updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/locations", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Location created successfully");
      }
      
      fetchLocations();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save location");
    }
  };

  const handleEdit = (location) => {
    setFormData({
      name: location.name,
      shortCode: location.shortCode,
      warehouse: location.warehouse._id
    });
    setCurrentId(location._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this location?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/locations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Location deleted");
      fetchLocations();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({ name: '', shortCode: '', warehouse: '' });
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate("/warehouse")}
                style={{ padding: '8px 12px' }}
              >
                <ArrowLeft size={16} />
              </button>
              <h2 style={{ color: 'var(--brown)', fontSize: 24, fontWeight: 700, margin: 0 }}>
                Locations
              </h2>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} /> New Location
            </button>
          </div>

          {locations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <MapPin size={48} color="#ccc" style={{ marginBottom: 16 }} />
              <p>No locations found. Create your first location!</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--brown)' }}>
                <tr>
                  {['Location Name', 'Short Code', 'Warehouse', 'Actions'].map(header => (
                    <th key={header} style={{ 
                      textAlign: 'left', 
                      padding: '12px 16px', 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: 13,
                      textTransform: 'uppercase'
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc._id} style={{ borderBottom: '1px solid var(--cream)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--brown)' }}>
                      {loc.name}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="chip" style={{ fontSize: 11, padding: '3px 8px' }}>
                        {loc.shortCode}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#666' }}>
                      {loc.warehouse?.name} ({loc.warehouse?.shortCode})
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => handleEdit(loc)}
                          style={{ fontSize: 12, padding: '6px 10px' }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="btn btn-cancel" 
                          onClick={() => handleDelete(loc._id)}
                          style={{ fontSize: 12, padding: '6px 10px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3>{editMode ? 'Edit Location' : 'New Location'}</h3>
              <button onClick={resetForm} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <div className="profile-field">
                <label className="profile-label">Location Name *</label>
                <input
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shelf A1"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Short Code *</label>
                <input
                  className="input"
                  value={formData.shortCode}
                  onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                  placeholder="e.g. WH/Stock1"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Warehouse *</label>
                <select
                  className="select"
                  value={formData.warehouse}
                  onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(wh => (
                    <option key={wh._id} value={wh._id}>
                      {wh.name} ({wh.shortCode})
                    </option>
                  ))}
                </select>
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

export default LocationPage;

