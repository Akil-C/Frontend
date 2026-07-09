import { useState, useEffect } from 'react';
import { FiEye, FiDownload, FiCheck } from 'react-icons/fi';
import { getAllOrders, updateOrderStatus, downloadInvoice } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';

const STATUS_OPTIONS = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  const fetchOrders = async (pg) => {
    setLoading(true);
    try {
      const res = await getAllOrders({ page: pg, size: 20 });
      setOrders(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 0);
      setPage(pg);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      fetchOrders(page);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDownload = async (orderId) => {
    try {
      const res = await downloadInvoice(orderId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Could not download invoice');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="orders" />
      <div className="admin-content">
        <header className="admin-header">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Manage Orders</h1>
        </header>

        <main className="admin-page">
          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : (
            <>
              <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Restaurant</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 700 }}>#{order.id}</td>
                        <td>{order.user?.name || 'Guest'}</td>
                        <td>{order.restaurant?.name}</td>
                        <td>₹{order.totalAmount?.toFixed(2)}</td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{
                              padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                              border: '1.5px solid var(--color-border)', fontSize: '0.8125rem',
                              fontWeight: 600, color: 'var(--color-text)', background: 'var(--color-card)'
                            }}
                            aria-label={`Change status for order #${order.id}`}
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
                            ))}
                          </select>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDownload(order.id)} aria-label={`Download invoice for order #${order.id}`}>
                              <FiDownload />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => fetchOrders(page - 1)} disabled={page === 0}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} className={`page-btn ${page === i ? 'active' : ''}`} onClick={() => fetchOrders(i)}>{i + 1}</button>
                  ))}
                  <button className="page-btn" onClick={() => fetchOrders(page + 1)} disabled={page === totalPages - 1}>›</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;
