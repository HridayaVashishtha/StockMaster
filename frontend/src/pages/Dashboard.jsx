import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, TrendingUp, TrendingDown, AlertTriangle, Clock, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { injectGlobalStyles } from "../styles/colors";

export default function Dashboard() {
  useEffect(() => { injectGlobalStyles(); }, []);

  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: { total: 0, lowStock: 0 },
    receipts: { total: 0, pending: 0, done: 0 },
    deliveries: { total: 0, pending: 0, done: 0 },
    moveHistory: { total: 0, recent: [] }
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [productsRes, receiptsRes, deliveriesRes, movesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/products", { headers }),
        axios.get("http://localhost:5000/api/receipts/statistics", { headers }),
        axios.get("http://localhost:5000/api/deliveries/statistics", { headers }),
        axios.get("http://localhost:5000/api/move-history?limit=3", { headers })
      ]);

      const products = productsRes.data;
      const lowStockProducts = products.filter(p => p.freeToUse < p.minQuantity);

      setStats({
        products: {
          total: products.length,
          lowStock: lowStockProducts.length,
          totalValue: products.reduce((sum, p) => sum + (p.onHand * p.costPerUnit), 0)
        },
        // include late waiting (fallback to 0 if API doesn’t provide)
        receipts: {
          ...receiptsRes.data,
          lateWaiting: receiptsRes.data.lateWaiting ?? receiptsRes.data.waitingLate ?? 0
        },
        deliveries: {
          ...deliveriesRes.data,
          lateWaiting: deliveriesRes.data.lateWaiting ?? deliveriesRes.data.waitingLate ?? 0
        },
        moveHistory: {
          total: movesRes.data.length,
          recent: movesRes.data.slice(0, 3)
        }
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick, badge }) => (
    <div 
      className="card" 
      style={{ 
        flex: '1 1 300px', 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        position: 'relative',
        minHeight: 160
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: 14, 
            color: '#666', 
            fontWeight: 600, 
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 8
          }}>
            {title}
          </div>
          <div style={{ 
            fontSize: 36, 
            fontWeight: 700, 
            color: color || 'var(--brown)',
            lineHeight: 1
          }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>
              {subtitle}
            </div>
          )}
        </div>
        <div style={{ 
          width: 56, 
          height: 56, 
          borderRadius: 12, 
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={28} color={color} />
        </div>
      </div>

      {badge && (
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid var(--cream)',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          {badge.map((b, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: b.color
              }} />
              <span style={{ fontSize: 13, color: '#666' }}>
                <strong style={{ color: b.color }}>{b.value}</strong> {b.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {onClick && (
        <div style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          color: color,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 13,
          fontWeight: 600
        }}>
          View Details <ArrowRight size={14} />
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
          <p style={{ color: 'var(--brown)', fontSize: 18 }}>Loading dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: '32px', minHeight: '100vh', background: 'var(--cream)' }}>
        {/* Main Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          marginBottom: 32
        }}>
          <StatCard
            title="Total Products"
            value={stats.products.total}
            subtitle={`₹${stats.products.totalValue.toLocaleString('en-IN')} total value`}
            icon={Package}
            color="var(--brown)"
            onClick={() => navigate("/products")}
            badge={stats.products.lowStock > 0 ? [
              { value: stats.products.lowStock, label: 'Low Stock', color: '#dc2626' }
            ] : null}
          />

          <StatCard
            title="Receipts"
            value={stats.receipts.pending}
            subtitle={`${stats.receipts.done} completed`}
            icon={TrendingUp}
            color="#10b981"
            onClick={() => navigate("/receipts")}
            badge={[
              { value: stats.receipts.pending ?? 0, label: 'Pending', color: '#f59e0b' },
              { value: stats.receipts.done ?? 0, label: 'Done', color: '#10b981' },
              { value: stats.receipts.lateWaiting ?? 0, label: 'Late Waiting', color: '#ef4444' }
            ]}
          />

          <StatCard
            title="Deliveries"
            value={stats.deliveries.pending}
            subtitle={`${stats.deliveries.done} completed`}
            icon={TrendingDown}
            color="#ef4444"
            onClick={() => navigate("/deliveries")}
            badge={[
              { value: stats.deliveries.pending ?? 0, label: 'Pending', color: '#f59e0b' },
              { value: stats.deliveries.done ?? 0, label: 'Done', color: '#10b981' },
              { value: stats.deliveries.lateWaiting ?? 0, label: 'Late Waiting', color: '#ef4444' }
            ]}
          />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
          {/* Recent Move History */}
          <div className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: '2px solid var(--brown)'
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--brown)', margin: 0 }}>
                Recent Activity
              </h3>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate("/move-history")}
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                View All
              </button>
            </div>

            {stats.moveHistory.recent.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '40px 20px' }}>
                No recent activity
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.moveHistory.recent.map((move) => (
                  <div 
                    key={move._id} 
                    style={{ 
                      padding: 16, 
                      background: 'var(--cream)', 
                      borderRadius: 8,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>
                        {move.product?.name || 'Product'}
                      </div>
                      <div style={{ fontSize: 13, color: '#666' }}>
                        {move.type} • {move.quantity} units
                      </div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                        {new Date(move.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <span 
                      className="chip" 
                      style={{ 
                        fontSize: 11, 
                        padding: '4px 10px',
                        backgroundColor: move.type === 'RECEIPT' ? '#D1FAE5' : '#FEE2E2',
                        color: move.type === 'RECEIPT' ? '#065F46' : '#991B1B',
                        border: 'none'
                      }}
                    >
                      {move.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div style={{ 
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: '2px solid var(--brown)'
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--brown)', margin: 0 }}>
                Quick Actions
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate("/receipts")}
                style={{ 
                  width: '100%', 
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  fontSize: 15
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <TrendingUp size={20} />
                  Create Receipt
                </span>
                <ArrowRight size={18} />
              </button>

              <button 
                className="btn btn-secondary" 
                onClick={() => navigate("/deliveries")}
                style={{ 
                  width: '100%', 
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  fontSize: 15
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <TrendingDown size={20} />
                  Create Delivery
                </span>
                <ArrowRight size={18} />
              </button>

              <button 
                className="btn btn-secondary" 
                onClick={() => navigate("/products")}
                style={{ 
                  width: '100%', 
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  fontSize: 15
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Package size={20} />
                  Manage Products
                </span>
                <ArrowRight size={18} />
              </button>

              <button 
                className="btn btn-secondary" 
                onClick={() => navigate("/move-history")}
                style={{ 
                  width: '100%', 
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  fontSize: 15
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Clock size={20} />
                  View History
                </span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.products.lowStock > 0 && (
          <div className="card" style={{ 
            marginTop: 24,
            background: '#FEF3C7',
            borderColor: '#F59E0B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <AlertTriangle size={32} color="#F59E0B" />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, marginBottom: 4, color: '#92400E', fontSize: 16, fontWeight: 700 }}>
                  Low Stock Alert
                </h4>
                <p style={{ margin: 0, color: '#92400E', fontSize: 14 }}>
                  {stats.products.lowStock} product{stats.products.lowStock > 1 ? 's are' : ' is'} running low on stock
                </p>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate("/products")}
                style={{ fontSize: 14 }}
              >
                View Products
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}