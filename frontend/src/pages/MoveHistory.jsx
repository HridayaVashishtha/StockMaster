import React, { useState, useEffect } from 'react';
import { Search, Download, Printer, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function MoveHistory() {
  const [moves, setMoves] = useState([
    {
      reference: 'WH/PUR/0002',
      date: '12/1/2025',
      contact: 'Asus Infonet',
      from: '',
      to: 'WH/Stock1',
      quantity: '',
      status: 'Ready'
    },
    {
      reference: 'WH/OUT/0002',
      date: '12/1/2025',
      contact: 'Asus Infonet',
      from: 'WH/Stock1',
      to: 'Vendor',
      quantity: '',
      status: 'Ready'
    },
    {
      reference: 'WH/PUR/0002',
      date: '12/1/2025',
      contact: 'Asus Infonet',
      from: 'WH/Stock2',
      to: 'Vendor',
      quantity: '',
      status: 'Ready'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredMoves = moves.filter(move => 
    move.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    move.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    move.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    move.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    pageWrapper: {
      minHeight: '100vh',
      backgroundColor: '#F8E1B7',
      padding: '0'
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
      marginBottom: '32px',
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
      color: '#754E1A',
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
    toolbarCard: {
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
    searchContainer: {
      position: 'relative',
      flex: '1',
      minWidth: '300px'
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px 12px 44px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    searchIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#6b7280'
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    iconButton: {
      backgroundColor: '#754E1A',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s'
    },
    tableCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    thead: {
      backgroundColor: '#754E1A'
    },
    th: {
      padding: '16px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      borderBottom: 'none'
    },
    tr: {
      borderBottom: '1px solid #e5e7eb',
      transition: 'background-color 0.2s'
    },
    td: {
      padding: '16px',
      fontSize: '14px',
      color: '#374151'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      backgroundColor: '#B6CBBD',
      color: '#1f2937'
    },
    notesSection: {
      backgroundColor: '#FFF8E7',
      borderRadius: '12px',
      padding: '24px 32px',
      marginTop: '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    notesTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#754E1A',
      marginBottom: '16px'
    },
    notesList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    noteItem: {
      fontSize: '14px',
      color: '#B8592A',
      marginBottom: '12px',
      lineHeight: '1.6',
      paddingLeft: '20px',
      position: 'relative'
    },
    noteBullet: {
      position: 'absolute',
      left: 0,
      top: '6px',
      width: '6px',
      height: '6px',
      backgroundColor: '#B8592A',
      borderRadius: '50%'
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>Move History</h1>
            <button 
              style={styles.newButton}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a3baa9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#B6CBBD'}
            >
              NEW
            </button>
          </div>

          {/* Toolbar */}
          <div style={styles.toolbarCard}>
            <div style={styles.searchContainer}>
              <Search size={20} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by reference, contact, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => e.target.style.borderColor = '#754E1A'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            <div style={styles.actionButtons}>
              <button 
                style={styles.iconButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5d3e15'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#754E1A'}
                title="Export"
              >
                <Download size={20} />
              </button>
              <button 
                style={styles.iconButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5d3e15'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#754E1A'}
                title="Print"
              >
                <Printer size={20} />
              </button>
              <button 
                style={styles.iconButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5d3e15'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#754E1A'}
                title="Generate Report"
              >
                <FileText size={20} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Reference</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Contact</th>
                  <th style={styles.th}>From</th>
                  <th style={styles.th}>To</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMoves.map((move, index) => (
                  <tr 
                    key={index} 
                    style={styles.tr}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td style={styles.td}>{move.reference}</td>
                    <td style={styles.td}>{move.date}</td>
                    <td style={styles.td}>{move.contact}</td>
                    <td style={styles.td}>{move.from || '-'}</td>
                    <td style={styles.td}>{move.to}</td>
                    <td style={styles.td}>{move.quantity || '-'}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge}>{move.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes Section */}
          <div style={styles.notesSection}>
            <h3 style={styles.notesTitle}>Important Notes</h3>
            <ul style={styles.notesList}>
              <li style={styles.noteItem}>
                <span style={styles.noteBullet}></span>
                Populate all moves done between the From → To location in inventory
              </li>
              <li style={styles.noteItem}>
                <span style={styles.noteBullet}></span>
                If single reference has multiple product display it in multiple rows
              </li>
              <li style={styles.noteItem}>
                <span style={styles.noteBullet}></span>
                In count should be shown in green, Out moves should be displayed in red
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}