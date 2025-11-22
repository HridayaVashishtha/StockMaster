import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building, Briefcase, Calendar, Edit2, Save, X, Camera, Lock } from 'lucide-react';
import axios from 'axios';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    location: '',
    joinDate: '',
    employeeId: ''
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // or however you store auth token
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        
        setProfile(response.data);
        setEditedProfile(response.data);
        
        // Check if user is admin/inventory manager
        setIsAdmin(response.data.role === 'Inventory Manager');
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
      await axios.put('http://localhost:5000/api/profile', editedProfile, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      setProfile({ ...editedProfile });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
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
    if (passwordData.newPassword === passwordData.confirmPassword) {
      try {
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:5000/api/profile/password', {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        
        alert('Password updated successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (error) {
        console.error('Error updating password:', error);
        alert('Failed to update password');
      }
    } else {
      alert('New passwords do not match!');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8E1B7' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: '#754E1A' }}></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F8E1B7' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-semibold"
                  style={{ background: 'linear-gradient(to bottom right, #B6CBBD, #754E1A)' }}
                >
                  {profile.firstName && profile.lastName ? 
                    `${profile.firstName[0]}${profile.lastName[0]}` : 
                    '?'}
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Basic Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.firstName || profile.lastName ? 
                    `${profile.firstName} ${profile.lastName}` : 
                    'User Profile'}
                </h1>
                <p className="text-gray-600 mt-1">{profile.role || 'No role assigned'}</p>
                <p className="text-sm text-gray-500 mt-1">{profile.employeeId || 'No ID'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: '#754E1A' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5d3e15'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#754E1A'}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: '#CBA35C' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b8923f'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#CBA35C'}
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Enter first name"
                />
              ) : (
                <p className="text-gray-900 px-3 py-2">{profile.firstName || 'Not provided'}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Enter last name"
                />
              ) : (
                <p className="text-gray-900 px-3 py-2">{profile.lastName || 'Not provided'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Enter email"
                />
              ) : (
                <p className="text-gray-900 px-3 py-2">{profile.email || 'Not provided'}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-gray-900 px-3 py-2">{profile.phone || 'Not provided'}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Enter location"
                />
              ) : (
                <p className="text-gray-900 px-3 py-2">{profile.location || 'Not provided'}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4" />
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Enter department"
                />
              ) : (
                <p className="text-gray-900 px-3 py-2">{profile.department || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4" />
                Role
              </label>
              {isEditing && isAdmin ? (
                <select
                  value={editedProfile.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="">Select Role</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Warehouse Staff">Warehouse Staff</option>
                </select>
              ) : (
                <p className="text-gray-900 px-3 py-2">{profile.role || 'Not assigned'}</p>
              )}
            </div>

            {/* Join Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Join Date
              </label>
              {isEditing && isAdmin ? (
                <input
                  type="date"
                  value={editedProfile.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              ) : (
                <p className="text-gray-900 px-3 py-2">{profile.joinDate || 'Not provided'}</p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Employee ID
              </label>
              {isEditing && isAdmin ? (
                <input
                  type="text"
                  value={editedProfile.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                  onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Enter employee ID"
                />
              ) : (
                <p className="text-gray-900 px-3 py-2">{profile.employeeId || 'Not assigned'}</p>
              )}
            </div>
          </div>

          {!isAdmin && isEditing && (
            <p className="text-sm text-gray-500 mt-4 italic">
              * Contact your administrator to update Role, Join Date, or Employee ID
            </p>
          )}
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
          
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#B6CBBD', color: '#1f2937' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a3baa9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#B6CBBD'}
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: '#754E1A' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5d3e15'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#754E1A'}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}