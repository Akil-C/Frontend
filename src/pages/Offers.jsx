import { useState, useEffect } from 'react';
import { FiCopy, FiCheckCircle } from 'react-icons/fi';
import { getActiveCoupons } from '../services/apiService';
import { useToast } from '../context/ToastContext';

const Offers = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getActiveCoupons()
      .then(res => setCoupons(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  return (
    <div className="page-enter">
      {/* Cover/Promo */}
      <section style={{
        background: 'linear-gradient(135deg, #120C1F 0%, #301934 100%)',
        padding: '4rem 0', color: '#fff', textAlign: 'center'
      }}>
        <div className="container">
          <span style={{ fontSize: '3rem' }} aria-hidden="true">🎁</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, margin: '0.75rem 0' }}>
            Deals & Offers For You
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.0625rem' }}>
            Get the best discounts and saving options on your favorite orders.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {loading ? (
          <div className="loading-overlay" style={{ minHeight: '30vh' }}><div className="spinner" /></div>
        ) : coupons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎟️</div>
            <h2 className="empty-state-title">No coupons available right now</h2>
            <p className="empty-state-desc">Check back soon for new discounts and deals.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {coupons.map(coupon => (
              <div
                key={coupon.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  border: '1.5px dashed var(--color-primary)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--color-card)'
                }}
              >
                {/* Visual discount badge */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  background: 'var(--color-primary)', color: '#fff',
                  fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px',
                  borderRadius: '0 0 0 8px'
                }}>
                  {coupon.discountPercentage ? `${coupon.discountPercentage}% OFF` : `₹${coupon.discountAmount} OFF`}
                </div>

                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Save big on your meal
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                  {coupon.minOrderValue ? `Valid on orders above ₹${coupon.minOrderValue}. ` : 'No minimum order value. '}
                  {coupon.maxDiscountAmount ? `Maximum discount up to ₹${coupon.maxDiscountAmount}.` : ''}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'var(--color-bg-alt)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
                    {coupon.code}
                  </span>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                    onClick={() => handleCopy(coupon.code)}
                    aria-label={`Copy coupon code ${coupon.code}`}
                  >
                    {copiedCode === coupon.code ? <><FiCheckCircle /> Copied</> : <><FiCopy /> Copy</>}
                  </button>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1rem', textAlign: 'right' }}>
                  Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
