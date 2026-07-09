import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLock, FiCreditCard } from 'react-icons/fi';
import { placeOrder } from '../services/apiService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { emptyCart } = useCart();
  const { toast } = useToast();
  const state = location.state || {};

  const [processing, setProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!state.addressId) { navigate('/cart'); }
  }, []);

  const formatCard = (val) => val.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length >= 2) return clean.slice(0, 2) + '/' + clean.slice(2);
    return clean;
  };

  const handlePlaceOrder = async () => {
    if (state.paymentMethod === 'CARD') {
      if (!cardForm.number || !cardForm.expiry || !cardForm.cvv || !cardForm.name) {
        toast.error('Please fill all card details'); return;
      }
    }
    if (state.paymentMethod === 'UPI' && !upiId) {
      toast.error('Please enter your UPI ID'); return;
    }

    setProcessing(true);
    // Simulate payment processing delay
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);

    setTimeout(async () => {
      try {
        let paymentMethodId = 6; // default COD
        if (state.paymentMethod === 'UPI') paymentMethodId = 1;
        else if (state.paymentMethod === 'CARD') paymentMethodId = 2;
        else if (state.paymentMethod === 'WALLET') paymentMethodId = 5;
        else if (state.paymentMethod === 'COD') paymentMethodId = 6;

        const payload = {
          addressId: state.addressId,
          paymentMethodId: paymentMethodId,
          notes: state.notes,
          couponCode: state.couponCode,
        };
        const res = await placeOrder(payload);
        const order = res.data.data;
        await emptyCart();
        toast.success('Order placed successfully! 🎉');
        navigate(`/order-success/${order.id}`, { replace: true });
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
        toast.error(msg);
        setProcessing(false);
        setCountdown(null);
      }
    }, 3200);
  };

  return (
    <div className="page-enter">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 600 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
          {processing ? '⏳ Processing Payment...' : '🔒 Secure Payment'}
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '0.9375rem' }}>
          {processing ? 'Please wait, do not refresh or go back.' : 'Your payment is 100% secure and encrypted'}
        </p>

        {/* Processing Animation */}
        {processing && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem', animation: 'float 1.5s ease-in-out infinite' }} aria-hidden="true">
              💳
            </div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
              {countdown > 0 ? `Processing in ${countdown}...` : 'Finalizing order...'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-primary)', animation: `bounce-in 1s ease ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {!processing && (
          <>
            {/* Payment Summary */}
            <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Payment Method</span>
                <span style={{ fontWeight: 700 }}>
                  {state.paymentMethod === 'COD' ? '💵 Cash on Delivery' :
                   state.paymentMethod === 'CARD' ? '💳 Card' :
                   state.paymentMethod === 'UPI' ? '📱 UPI' : '👛 Wallet'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Total Amount</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ₹{state.total?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>

            {/* Card Form */}
            {state.paymentMethod === 'CARD' && (
              <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  <FiCreditCard color="var(--color-primary)" /> Card Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="card-name">Name on Card</label>
                    <input id="card-name" className="form-input" placeholder="John Doe" value={cardForm.name} onChange={e => setCardForm(p => ({ ...p, name: e.target.value }))} autoComplete="cc-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="card-number">Card Number</label>
                    <input id="card-number" className="form-input" placeholder="1234 5678 9012 3456" value={cardForm.number} onChange={e => setCardForm(p => ({ ...p, number: formatCard(e.target.value) }))} autoComplete="cc-number" maxLength={19} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="card-expiry">Expiry</label>
                      <input id="card-expiry" className="form-input" placeholder="MM/YY" value={cardForm.expiry} onChange={e => setCardForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} autoComplete="cc-exp" maxLength={5} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="card-cvv">CVV</label>
                      <input id="card-cvv" className="form-input" placeholder="123" value={cardForm.cvv} onChange={e => setCardForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) }))} autoComplete="cc-csc" maxLength={4} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UPI Form */}
            {state.paymentMethod === 'UPI' && (
              <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📱 Enter UPI ID</h3>
                <div className="form-group">
                  <label className="form-label" htmlFor="upi-id">UPI ID</label>
                  <input id="upi-id" className="form-input" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                </div>
              </div>
            )}

            {state.paymentMethod === 'COD' && (
              <div style={{ background: 'var(--color-secondary-bg)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1.5px dashed var(--color-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }} aria-hidden="true">💵</p>
                <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Pay with Cash</p>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>Keep ₹{state.total?.toFixed(2)} ready for our delivery partner</p>
              </div>
            )}

            <button
              id="confirm-payment-btn"
              className="btn btn-primary w-full"
              style={{ padding: '1rem', fontSize: '1.0625rem' }}
              onClick={handlePlaceOrder}
            >
              <FiLock size={18} aria-hidden="true" />
              {state.paymentMethod === 'COD' ? 'Place Order' : `Pay ₹${state.total?.toFixed(2)}`}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
              🔐 256-bit SSL encrypted · PCI-DSS compliant
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
