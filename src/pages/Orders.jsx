import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiDownload, FiEye } from 'react-icons/fi';
import { getOrderHistory, downloadInvoice } from '../services/apiService';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';

const STATUS_COLORS = {
  PLACED: { bg: '#e3f2fd', color: '#1565c0' },
  CONFIRMED: { bg: '#f3e5f5', color: '#6a1b9a' },
  PREPARING: { bg: '#fff3e0', color: '#e65100' },
  READY: { bg: '#e8f5e9', color: '#2e7d32' },
  ON_THE_WAY: { bg: '#fff8e1', color: '#f57f17' },
  DELIVERED: { bg: '#e0f2f1', color: '#00695c' },
  CANCELLED: { bg: '#fce4ec', color: '#b71c1c' },
};

const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const fetchOrders = async (pg) => {
    setLoading(true);
    try {
      const res = await getOrderHistory({ page: pg, size: 10 });
      const data = res.data.data;
      setOrders(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setPage(pg);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
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
      toast.success('Invoice downloaded!');
    } catch { toast.error('Could not download invoice'); }
  };

  return (
    <div className="page-enter">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.75rem' }}>
          My Orders 📦
        </h1>

        {loading ? (
          <SkeletonLoader type="text" count={5} />
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h2 className="empty-state-title">No orders yet</h2>
            <p className="empty-state-desc">Looks like you haven't placed any orders. Start ordering now!</p>
            <Link to="/home" className="btn btn-primary">Browse Restaurants</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => {
              const sc = STATUS_COLORS[order.status] || STATUS_COLORS.PLACED;
              return (
                <article key={order.id} style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', transition: 'box-shadow 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }} aria-hidden="true">
                        🍱
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '1rem' }}>{order.restaurant?.name}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0' }}>
                          Order #{order.id} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                          {(order.items || []).slice(0, 2).map(i => i.food?.name).join(', ')}
                          {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <span style={{ ...sc, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 700 }} aria-label={`Status: ${order.status}`}>
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text)' }}>
                        ₹{order.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-light)' }}>
                    <Link to={`/orders/${order.id}`} className="btn btn-ghost btn-sm" aria-label={`View order #${order.id} details`}>
                      <FiEye size={14} /> View Details
                    </Link>
                    {order.status === 'DELIVERED' && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDownload(order.id)} aria-label={`Download invoice for order #${order.id}`}>
                        <FiDownload size={14} /> Invoice
                      </button>
                    )}
                    <Link to="/home" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>
                      Reorder
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="pagination" aria-label="Orders pagination">
            <button className="page-btn" onClick={() => fetchOrders(page - 1)} disabled={page === 0} aria-label="Previous page">‹</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
              <button key={i} className={`page-btn ${page === i ? 'active' : ''}`} onClick={() => fetchOrders(i)} aria-current={page === i ? 'page' : undefined}>{i + 1}</button>
            ))}
            <button className="page-btn" onClick={() => fetchOrders(page + 1)} disabled={page === totalPages - 1} aria-label="Next page">›</button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Orders;
