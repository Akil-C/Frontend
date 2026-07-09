import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiMapPin } from 'react-icons/fi';
import { getOrderById, downloadInvoice } from '../services/apiService';
import { useToast } from '../context/ToastContext';

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'ON_THE_WAY', 'DELIVERED'];
const STATUS_LABELS = {
  PLACED: 'Order Placed',
  CONFIRMED: 'Confirmed by Restaurant',
  PREPARING: 'Preparing Your Food',
  READY: 'Ready for Pickup',
  ON_THE_WAY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};

const OrderDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then(r => setOrder(r.data.data)).catch(() => { toast.error('Order not found'); navigate('/orders'); }).finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    try {
      const res = await downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
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
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 750 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/orders')} aria-label="Back to orders"><FiArrowLeft size={20} /></button>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Order #{order.id}</h1>
          {order.status === 'DELIVERED' && (
            <button className="btn btn-outline btn-sm" onClick={handleDownload} style={{ marginLeft: 'auto' }} aria-label="Download invoice PDF">
              <FiDownload size={14} /> Invoice
            </button>
          )}
        </div>

        {/* Status Tracker */}
        <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.0625rem' }}>
            <FiMapPin color="var(--color-primary)" /> Order Tracking
          </h2>
          <div className="order-track" role="list">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className={`track-step ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`} role="listitem">
                <div className="track-dot" aria-hidden="true">{i < currentStep ? '✓' : i + 1}</div>
                <div>
                  <p className="track-step-title">{STATUS_LABELS[step]}</p>
                  {i === currentStep && <p className="track-step-time">Active</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.0625rem' }}>🍱 Items Ordered</h2>
          {(order.items || []).map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--color-border-light)', fontSize: '0.9375rem' }}>
              <span style={{ fontWeight: 500 }}>{item.food?.name} <span style={{ color: 'var(--color-text-muted)' }}>× {item.quantity}</span></span>
              <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.0625rem', marginTop: '0.875rem', paddingTop: '0.875rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-primary)' }}>₹{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery & Payment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9375rem' }}>📍 Delivery Address</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {order.deliveryAddress}
            </p>
          </div>
          <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9375rem' }}>💳 Payment</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Method: <strong>{order.payment?.paymentMethod?.name || 'N/A'}</strong><br />
              Status: <strong style={{ color: order.payment?.status === 'COMPLETED' ? 'var(--color-accent)' : 'var(--color-warning)' }}>{order.payment?.status || 'PENDING'}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
