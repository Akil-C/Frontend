import { useState, useEffect } from 'react';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import { getDashboardStats } from '../../services/apiService';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar active="dashboard" />
      <div className="admin-content">
        <header className="admin-header">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Admin Dashboard</h1>
        </header>

        <main className="admin-page">
          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : (
            <>
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {[
                  { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: <FiDollarSign />, colorClass: 'teal' },
                  { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingBag />, colorClass: 'orange' },
                  { label: 'Total Restaurants', value: stats?.totalRestaurants || 0, icon: <FiTrendingUp />, colorClass: 'red' },
                  { label: 'Active Users', value: stats?.totalUsers || 0, icon: <FiUsers />, colorClass: 'purple' },
                ].map((s, idx) => (
                  <div key={idx} className="stat-card">
                    <div className={`stat-icon ${s.colorClass}`} aria-hidden="true">
                      {s.icon}
                    </div>
                    <div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status breakdown table */}
              <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Status Breakdown</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.orderStatusBreakdown && Object.entries(stats.orderStatusBreakdown).map(([status, count]) => (
                        <tr key={status}>
                          <td style={{ fontWeight: 600 }}>{status}</td>
                          <td>{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Restaurants chart summary */}
              <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Restaurants by Order Count</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats?.restaurantOrderCounts && Object.entries(stats.restaurantOrderCounts).map(([name, count]) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ width: '150px', fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                      <div style={{ flex: 1, height: '16px', background: 'var(--color-bg-alt)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (count / (stats.totalOrders || 1)) * 100)}%`, height: '100%', background: 'var(--color-primary)' }} />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
