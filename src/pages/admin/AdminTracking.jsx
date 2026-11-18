import { useState, useEffect } from 'react';
import { FiShield, FiCheckCircle, FiAlertTriangle, FiRefreshCw, FiSearch, FiMonitor, FiUser } from 'react-icons/fi';
import { getLoginTrackingAudits } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';

const AdminTracking = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { toast } = useToast();

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const res = await getLoginTrackingAudits();
      setAudits(res.data.data || []);
    } catch {
      toast.error('Failed to load tracking audits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  // Filtered audits
  const filteredAudits = audits.filter(a => {
    const matchesSearch = !search.trim() ||
      a.userName?.toLowerCase().includes(search.toLowerCase()) ||
      a.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      a.ipAddress?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'SUCCESS' && a.status === 'SUCCESS') ||
      (statusFilter === 'FAILED' && a.status === 'FAILED');

    return matchesSearch && matchesStatus;
  });

  const totalAudits = audits.length;
  const successCount = audits.filter(a => a.status === 'SUCCESS').length;
  const failedCount = audits.filter(a => a.status === 'FAILED').length;
  const successRate = totalAudits > 0 ? ((successCount / totalAudits) * 100).toFixed(1) : 100;

  return (
    <div className="admin-layout">
      <AdminSidebar active="tracking" />
      <div className="admin-content">
        <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              Security & Login Tracking Audits
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '2px' }}>
              Real-time authentication monitoring, IP tracking, and suspicious login attempt detection.
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={fetchAudits}
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FiRefreshCw className={loading ? 'spin' : ''} />
            <span>Refresh Audit Logs</span>
          </button>
        </header>

        <main className="admin-page">
          {/* Key Security Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--color-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Monitored</span>
                <FiMonitor style={{ color: 'var(--color-primary)' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--color-text)' }}>
                {totalAudits}
              </div>
            </div>

            <div style={{ background: 'var(--color-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Successful Logins</span>
                <FiCheckCircle style={{ color: '#2d6a4f' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#2d6a4f' }}>
                {successCount}
              </div>
            </div>

            <div style={{ background: 'var(--color-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Failed Attempts</span>
                <FiAlertTriangle style={{ color: '#d90429' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#d90429' }}>
                {failedCount}
              </div>
            </div>

            <div style={{ background: 'var(--color-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Auth Health</span>
                <FiShield style={{ color: 'var(--color-primary)' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--color-primary)' }}>
                {successRate}%
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search audit by user, email, or IP address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-card)',
                  color: 'var(--color-text)',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status:</span>
              {['ALL', 'SUCCESS', 'FAILED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {st.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : (
            <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>Log ID</th>
                    <th>User Identity</th>
                    <th>IP Address & Client</th>
                    <th>Timestamp</th>
                    <th>Audit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudits.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                        No login audit logs found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAudits.map(audit => (
                      <tr key={audit.id}>
                        <td style={{ fontWeight: 700, color: 'var(--color-text-muted)' }}>#{audit.id}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 700 }}>
                              {audit.userName ? audit.userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{audit.userName}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{audit.userEmail} (ID: #{audit.userId})</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, padding: '2px 6px', background: 'var(--color-background-alt)', borderRadius: '4px', fontSize: '0.82rem' }}>
                            {audit.ipAddress || '127.0.0.1'}
                          </span>
                        </td>
                        <td>{new Date(audit.loginTime).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${audit.status === 'SUCCESS' ? 'badge-success' : 'badge-nonveg'}`}>
                            {audit.status === 'SUCCESS' ? <FiCheckCircle style={{ marginRight: '4px' }} /> : <FiAlertTriangle style={{ marginRight: '4px' }} />}
                            {audit.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminTracking;
