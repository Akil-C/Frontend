import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiDownload, FiPackage, FiMapPin } from 'react-icons/fi';
import { getOrderById, downloadInvoice } from '../services/apiService';
import { useToast } from '../context/ToastContext';

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'ON_THE_WAY', 'DELIVERED'];
const STATUS_LABELS = {
  PLACED: 'Order Placed',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY: 'Ready for Pickup',
  ON_THE_WAY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(orderId)
      .then(r => setOrder(r.data.data))
      .catch(() => { toast.error('Order not found'); navigate('/orders'); })
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleDownloadInvoice = async () => {
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

  if (loading) return <div className="loading-overlay" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="page-enter">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: 700 }}>
        {/* Success header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="success-icon success-animation" aria-hidden="true">✅</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--color-accent)' }}>
            Order Placed! 🎉
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem' }}>
            Your order #{order.id} has been placed successfully.<br />
            {order.restaurant?.name} is preparing your food with love!
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={handleDownloadInvoice} id="download-invoice-btn" aria-label="Download invoice PDF">
              <FiDownload /> Download Invoice
            </button>
            <Link to="/orders" className="btn btn-ghost">
              <FiPackage /> All Orders
            </Link>
          </div>
        </div>

        {/* Live Order Tracking */}
        <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiMapPin color="var(--color-primary)" /> Live Order Status
          </h2>
          <div className="order-track" role="list" aria-label="Order status steps">
            {STATUS_STEPS.map((step, i) => (
              <div
                key={step}
                className={`track-step ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}
                role="listitem"
                aria-current={i === currentStep ? 'step' : undefined}
              >
                <div className="track-dot" aria-hidden="true">{i < currentStep ? '✓' : i + 1}</div>
                <div>
                  <p className="track-step-title">{STATUS_LABELS[step]}</p>
                  {i === currentStep && (
                    <p className="track-step-time">Current Status</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Details</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border-light)' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Restaurant</span>
            <span style={{ fontWeight: 600 }}>{order.restaurant?.name}</span>
          </div>
          {(order.items || []).map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.9375rem' }}>
              <span>{item.food?.name} × {item.quantity}</span>
              <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.0625rem' }}>
            <span>Total Paid</span>
            <span style={{ color: 'var(--color-primary)' }}>₹{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/home" className="btn btn-primary" style={{ padding: '0.875rem 2.5rem', fontSize: '1rem' }}>
            🍕 Order More Food
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
