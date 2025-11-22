import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building, Briefcase, Calendar, Edit2, Save, X, Camera, Lock } from 'lucide-react';
import axios from 'axios';
import { injectGlobalStyles } from '../styles/colors';

export default function Profile() {
  injectGlobalStyles();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(data);
        setEditedProfile(data);
        setIsAdmin(data.role === 'InventoryManager');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put('http://localhost:5000/api/profile', editedProfile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(data.user);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Password updated successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      alert(error.response?.data?.error || 'Failed to update password');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {profile.name ? profile.name[0] : '?'}
              </div>

              <div className="profile-info">
                <h1>{profile.name || 'User Profile'}</h1>
                <p className="role">{profile.role || 'No role'}</p>
                <p className="employee-id">{profile.email}</p>
              </div>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button onClick={handleEdit} className="btn btn-primary">
                  Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={handleCancel} className="btn btn-cancel">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn btn-primary">
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label className="profile-label">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="profile-input"
                  placeholder="Enter full name"
                />
              ) : (
                <p className="profile-value">{profile.name || 'Not provided'}</p>
              )}
            </div>

            <div className="profile-field">
              <label className="profile-label">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="profile-input"
                  placeholder="Enter email"
                />
              ) : (
                <p className="profile-value">{profile.email || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="profile-section">
          <h2>Work</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label className="profile-label">Role</label>
              {isEditing && isAdmin ? (
                <select
                  value={editedProfile.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="profile-select"
                >
                  <option value="WarehouseStaff">Warehouse Staff</option>
                  <option value="InventoryManager">Inventory Manager</option>
                </select>
              ) : (
                <p className="profile-value">{profile.role || 'Not assigned'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="profile-section">
          <h2>Security</h2>
          <button onClick={() => setShowPasswordModal(true)} className="btn btn-secondary">
            Change Password
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="modal-close">×</button>
            </div>

            <div className="modal-body">
              <div className="profile-field">
                <label className="profile-label">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="profile-input"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="profile-input"
                />
              </div>
              <div className="profile-field">
                <label className="profile-label">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="profile-input"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowPasswordModal(false)} className="btn btn-cancel">Cancel</button>
              <button onClick={handlePasswordSubmit} className="btn btn-primary">Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}