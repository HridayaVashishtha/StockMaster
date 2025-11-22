import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function DeliveryDetails() {
  const [deliveryData, setDeliveryData] = useState({
    reference: 'WH/OUT/0001',
    deliveryAddress: '',
    scheduleDate: '',
    responsible: '',
    operationType: ''
  });

  const [products, setProducts] = useState([
    { id: 1, name: '[DESK001] Desk', quantity: 6 }
  ]);

  const [status, setStatus] = useState('Draft');

  const handleInputChange = (field, value) => {
    setDeliveryData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductQuantityChange = (id, quantity) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, quantity: parseInt(quantity) || 0 } : product
      )
    );
  };

  const addNewProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: '',
      quantity: 0
    };
    setProducts([...products, newProduct]);
  };

  const styles = {
    pageWrapper: {
      minHeight: '100vh',
      backgroundColor: '#F8E1B7'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px'
    },
    header: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px 32px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    pageTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#B8592A',
      margin: 0
    },
    newButton: {
      backgroundColor: '#B6CBBD',
      color: '#1f2937',
      padding: '10px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.2s'
    },
    actionBar: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px 32px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    leftButtons: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    button: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: '2px solid #B8592A',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.2s',
      backgroundColor: 'white',
      color: '#B8592A'
    },
    statusBar: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    statusBadge: {
      padding: '8px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    statusDraft: {
      backgroundColor: '#FEF3C7',
      color: '#92400E',
      border: '2px solid #F59E0B'
    },
    statusWaiting: {
      backgroundColor: '#DBEAFE',
      color: '#1E40AF',
      border: '2px solid #3B82F6'
    },
    statusReady: {
      backgroundColor: '#D1FAE5',
      color: '#065F46',
      border: '2px solid #10B981'
    },
    statusDone: {
      backgroundColor: '#E0E7FF',
      color: '#3730A3',
      border: '2px solid #6366F1'
    },
    detailsCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    reference: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#B8592A',
      marginBottom: '32px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
      marginBottom: '32px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#B8592A',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #B8592A',
      borderRadius: '0',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
      backgroundColor: 'white'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #B8592A',
      borderRadius: '0',
      fontSize: '15px',
      outline: 'none',
      backgroundColor: 'white',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#B8592A',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '2px solid #B8592A'
    },
    productsTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px'
    },
    tableHeader: {
      borderBottom: '2px solid #B8592A'
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      color: '#B8592A'
    },
    td: {
      padding: '16px',
      fontSize: '15px',
      color: '#374151',
      borderBottom: '1px solid #F3E5D5'
    },
    productName: {
      color: '#B8592A',
      fontWeight: '500'
    },
    quantityInput: {
      width: '80px',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '15px',
      outline: 'none',
      textAlign: 'center'
    },
    addProductButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: 'white',
      color: '#B8592A',
      border: '2px solid #B8592A',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.2s'
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>Delivery</h1>
            <button 
              style={styles.newButton}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a3baa9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#B6CBBD'}
            >
              New
            </button>
          </div>

          {/* Action Bar */}
          <div style={styles.actionBar}>
            <div style={styles.leftButtons}>
              <button 
                style={styles.button}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#B8592A';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#B8592A';
                }}
              >
                Validate
              </button>
              <button 
                style={styles.button}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#B8592A';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#B8592A';
                }}
              >
                Print
              </button>
              <button 
                style={styles.button}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#B8592A';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#B8592A';
                }}
              >
                Cancel
              </button>
            </div>

            <div style={styles.statusBar}>
              <span 
                style={{...styles.statusBadge, ...styles.statusDraft}}
                onClick={() => setStatus('Draft')}
              >
                Draft
              </span>
              <span style={{ color: '#B8592A', fontSize: '18px' }}>{'>'}</span>
              <span 
                style={{...styles.statusBadge, ...styles.statusWaiting}}
                onClick={() => setStatus('Waiting')}
              >
                Waiting
              </span>
              <span style={{ color: '#B8592A', fontSize: '18px' }}>{'>'}</span>
              <span 
                style={{...styles.statusBadge, ...styles.statusReady}}
                onClick={() => setStatus('Ready')}
              >
                Ready
              </span>
              <span style={{ color: '#B8592A', fontSize: '18px' }}>{'>'}</span>
              <span 
                style={{...styles.statusBadge, ...styles.statusDone}}
                onClick={() => setStatus('Done')}
              >
                Done
              </span>
            </div>
          </div>

          {/* Details Card */}
          <div style={styles.detailsCard}>
            <div style={styles.reference}>{deliveryData.reference}</div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Delivery Address</label>
                <input
                  type="text"
                  value={deliveryData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  style={styles.input}
                  placeholder=""
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Schedule Date</label>
                <input
                  type="date"
                  value={deliveryData.scheduleDate}
                  onChange={(e) => handleInputChange('scheduleDate', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Responsible</label>
                <input
                  type="text"
                  value={deliveryData.responsible}
                  onChange={(e) => handleInputChange('responsible', e.target.value)}
                  style={styles.input}
                  placeholder=""
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Operation Type</label>
                <select
                  value={deliveryData.operationType}
                  onChange={(e) => handleInputChange('operationType', e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select Operation Type</option>
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pickup</option>
                  <option value="return">Return</option>
                </select>
              </div>
            </div>

            {/* Products Section */}
            <div style={styles.sectionTitle}>Products</div>

            <table style={styles.productsTable}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={{...styles.td, ...styles.productName}}>
                      {product.name}
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductQuantityChange(product.id, e.target.value)}
                        style={styles.quantityInput}
                        min="0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button 
              style={styles.addProductButton}
              onClick={addNewProduct}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#B8592A';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#B8592A';
              }}
            >
              <Plus size={18} />
              Add New Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
}