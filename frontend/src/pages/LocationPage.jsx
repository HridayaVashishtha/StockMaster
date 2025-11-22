import Navbar from "../components/Navbar";
import React, { useState } from 'react';

const colors = {
  sage: '#B6CBBD',
  brown: '#754E1A',
  gold: '#CBA35C',
  cream: '#F8E1B7'
};

const LocationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    warehouse: 'WH'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving location:', formData);
    // Add save logic here
  };

  return (
    <div>
        <Navbar />
        <main style={{ padding: '32px' }}>
        <div style={{
            backgroundColor: 'white',
            border: `2px solid ${colors.brown}`,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(117, 78, 26, 0.15)'
        }}>
            <h2 style={{
            color: colors.brown,
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '24px',
            borderBottom: `2px solid ${colors.sage}`,
            paddingBottom: '12px'
            }}>
            Location
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ color: colors.brown, fontSize: '14px', fontStyle: 'italic', width: '100px' }}>
                Name:
                </label>
                <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={{
                    flex: 1,
                    border: `1px solid ${colors.brown}`,
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    padding: '8px 10px',
                    fontSize: '14px',
                    outline: 'none'
                }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ color: colors.brown, fontSize: '14px', fontStyle: 'italic', width: '100px' }}>
                Short Code:
                </label>
                <input
                type="text"
                value={formData.shortCode}
                onChange={(e) => handleChange('shortCode', e.target.value)}
                style={{
                    flex: 1,
                    border: `1px solid ${colors.brown}`,
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    padding: '8px 10px',
                    fontSize: '14px',
                    outline: 'none'
                }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ color: colors.brown, fontSize: '14px', fontStyle: 'italic', width: '100px' }}>
                Warehouse:
                </label>
                <input
                type="text"
                value={formData.warehouse}
                onChange={(e) => handleChange('warehouse', e.target.value)}
                style={{
                    flex: 1,
                    border: `1px solid ${colors.brown}`,
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    padding: '8px 10px',
                    fontSize: '14px',
                    outline: 'none'
                }}
                />
            </div>
            </div>

            <button
            onClick={handleSave}
            style={{
                marginTop: '24px',
                backgroundColor: colors.gold,
                color: colors.brown,
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
            }}
            >
            Save Location
            </button>
        </div>
        </main>
    </div>
  );
};

export default LocationPage;

