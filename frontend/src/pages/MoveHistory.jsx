import React, { useState, useEffect } from 'react';
import { Search, Download, Printer, FileText, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { injectGlobalStyles } from '../styles/colors';

export default function MoveHistory() {
  useEffect(() => { injectGlobalStyles(); }, []);

  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [statistics, setStatistics] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMoveHistory();
    fetchStatistics();
  }, []);

  const fetchMoveHistory = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await axios.get(`http://localhost:5000/api/move-history?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMoves(res.data);
    } catch (error) {
      console.error("Error fetching move history:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/move-history/statistics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatistics(res.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMoveHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, typeFilter, statusFilter]);

  const getTypeColor = (type) => {
    switch(type) {
      case 'RECEIPT': return '#10b981';
      case 'DELIVERY': return '#ef4444';
      case 'TRANSFER': return '#3b82f6';
      case 'ADJUSTMENT': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading move history...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '32px' }}>
        <div className="container" style={{ maxWidth: 1400 }}>
          {/* Header with Statistics */}
          <div className="card" style={{ marginBottom: 24, padding: '24px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: 'var(--brown)' }}>
                Move History
              </h1>
              {statistics && (
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--brown)' }}>{statistics.total}</div>
                    <div style={{ fontSize: 12, color: '#997644' }}>Total Moves</div>
                  </div>
                  <div style={{ width: 1, background: 'var(--gold)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{statistics.byType.receipt}</div>
                    <div style={{ fontSize: 12, color: '#997644' }}>Receipts</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>{statistics.byType.delivery}</div>
                    <div style={{ fontSize: 12, color: '#997644' }}>Deliveries</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="card" style={{ marginBottom: 24, padding: '20px 28px' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#997644' }} />
                <input
                  className="input"
                  placeholder="Search reference, contact, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: 40 }}
                />
              </div>
              
              <select className="select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ width: 160 }}>
                <option value="">All Types</option>
                <option value="RECEIPT">Receipt</option>
                <option value="DELIVERY">Delivery</option>
                <option value="TRANSFER">Transfer</option>
                <option value="ADJUSTMENT">Adjustment</option>
              </select>

              <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 140 }}>
                <option value="">All Status</option>
                <option value="DONE">Done</option>
                <option value="DRAFT">Draft</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <button className="btn btn-secondary" title="Export">
                <Download size={16} />
              </button>
              <button className="btn btn-secondary" title="Print">
                <Printer size={16} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="card" style={{ overflow: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--brown)' }}>
                <tr>
                  {['Reference', 'Date', 'Product', 'Type', 'Quantity', 'From', 'To', 'Contact', 'Status'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {moves.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ padding: 40, textAlign: 'center', color: '#997644' }}>
                      No move history found
                    </td>
                  </tr>
                ) : (
                  moves.map((move) => (
                    <tr key={move._id} style={{ borderBottom: '1px solid var(--cream)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{move.reference}</td>
                      <td style={{ padding: '12px 16px', fontSize: 14 }}>{formatDate(move.createdAt)}</td>
                      <td style={{ padding: '12px 16px', fontSize: 14 }}>{move.product?.name || '-'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          background: `${getTypeColor(move.type)}15`,
                          color: getTypeColor(move.type)
                        }}>
                          {move.type}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        fontWeight: 600,
                        color: move.type === 'RECEIPT' || move.type === 'TRANSFER' ? '#10b981' : move.type === 'DELIVERY' ? '#ef4444' : 'inherit'
                      }}>
                        {move.type === 'RECEIPT' || move.type === 'TRANSFER' ? '+' : '-'}{Math.abs(move.quantity)} {move.product?.unit}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{move.fromLocation || '-'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280' }}>{move.toLocation || '-'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>{move.contact || '-'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="chip" style={{ fontSize: 11, padding: '3px 8px' }}>{move.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="card" style={{ marginTop: 28, background: 'var(--cream)', borderColor: 'var(--brown)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brown)', marginBottom: 12 }}>Important Notes</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#997644', fontSize: 13, lineHeight: 1.8 }}>
              <li>Receipt (IN) moves are shown in <strong style={{ color: '#10b981' }}>green</strong></li>
              <li>Delivery (OUT) moves are shown in <strong style={{ color: '#ef4444' }}>red</strong></li>
              <li>Each move automatically updates stock levels</li>
              <li>All moves are logged for audit trail and compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}