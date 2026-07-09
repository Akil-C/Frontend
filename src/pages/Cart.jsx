import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { validateCoupon } from '../services/apiService';

const DELIVERY_FEE = 40;
const PLATFORM_FEE = 5;

const Cart = () => {
  const { cart, loading, updateItem, removeItem, emptyCart, cartSubtotal } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleUpdateQty = async (cartItemId, currentQty, delta) => {
    if (currentQty + delta <= 0) {
      await removeItem(cartItemId);
    } else {
      await updateItem(cartItemId, currentQty + delta);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await validateCoupon(couponCode.trim());
      const coupon = res.data.data;
      if (!coupon.isActive) { toast.error('This coupon is no longer active'); return; }
      if (new Date(coupon.expiryDate) < new Date()) { toast.error('This coupon has expired'); return; }
      if (coupon.minOrderValue && cartSubtotal < coupon.minOrderValue) {
        toast.error(`Minimum order ₹${coupon.minOrderValue} required for this coupon`); return;
      }
      setAppliedCoupon(coupon);
      toast.success(`Coupon "${coupon.code}" applied! 🎉`);
    } catch {
      toast.error('Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const calcDiscount = () => {
    if (!appliedCoupon) return 0;
    let disc = 0;
    if (appliedCoupon.discountPercentage) disc = (cartSubtotal * appliedCoupon.discountPercentage) / 100;
    else if (appliedCoupon.discountAmount) disc = appliedCoupon.discountAmount;
    if (appliedCoupon.maxDiscountAmount) disc = Math.min(disc, appliedCoupon.maxDiscountAmount);
    return Math.round(disc * 100) / 100;
  };

  const discount = calcDiscount();
  const total = Math.max(0, cartSubtotal + DELIVERY_FEE + PLATFORM_FEE - discount);

  const items = cart?.items || [];

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state-icon">🛒</div>
        <h1 className="empty-state-title">Your cart is empty</h1>
        <p className="empty-state-desc">Add items from a restaurant to get started</p>
        <button className="btn btn-primary" onClick={() => navigate('/home')}>Browse Restaurants</button>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)} aria-label="Go back"><FiArrowLeft size={20} /></button>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800 }}>Your Cart 🛒</h1>
          <button className="btn btn-ghost" style={{ marginLeft: 'auto', color: 'var(--color-error)', fontSize: '0.875rem' }} onClick={emptyCart} aria-label="Clear cart">
            <FiTrash2 size={16} /> Clear All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
          {/* Cart Items */}
          <div>
            <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiShoppingBag color="var(--color-primary)" size={20} aria-hidden="true" />
                <div>
                  <div style={{ fontWeight: 700 }}>{cart?.restaurant?.name || 'Your Order'}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{items.length} item{items.length > 1 ? 's' : ''}</div>
                </div>
              </div>
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.food?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&auto=format&fit=crop'}
                    alt={item.food?.name}
                    className="cart-item-img"
                    loading="lazy"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&auto=format&fit=crop'; }}
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.food?.name}</p>
                    <p className="cart-item-price">₹{item.food?.price} each</p>
                    {item.notes && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>Note: {item.notes}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="cart-qty-control" role="group" aria-label={`${item.food?.name} quantity`}>
                      <button onClick={() => handleUpdateQty(item.id, item.quantity, -1)} aria-label="Decrease quantity">
                        <FiMinus size={14} />
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button onClick={() => handleUpdateQty(item.id, item.quantity, 1)} aria-label="Increase quantity">
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <span style={{ fontWeight: 700, minWidth: '60px', textAlign: 'right' }}>
                      ₹{(item.food?.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', padding: '1.25rem 1.5rem', marginTop: '1.25rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9375rem' }}>
                <FiTag color="var(--color-secondary)" aria-hidden="true" /> Apply Coupon
              </h3>
              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-accent-bg)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--color-accent)' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{appliedCoupon.code}</span>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>You save ₹{discount.toFixed(2)}</p>
                  </div>
                  <button className="btn btn-ghost" style={{ color: 'var(--color-error)', fontSize: '0.8125rem' }} onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}>
                    Remove
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    id="coupon-input"
                    className="form-input"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    style={{ flex: 1 }}
                    aria-label="Coupon code input"
                  />
                  <button className="btn btn-secondary" onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()} aria-label="Apply coupon">
                    {couponLoading ? <span className="spinner spinner-sm" /> : 'Apply'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bill Summary */}
          <aside>
            <div className="bill-summary" aria-label="Order summary">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Bill Summary</h3>
              <div className="bill-row"><span>Item Total</span><span>₹{cartSubtotal.toFixed(2)}</span></div>
              <div className="bill-row"><span>Delivery Fee</span><span>₹{DELIVERY_FEE}</span></div>
              <div className="bill-row"><span>Platform Fee</span><span>₹{PLATFORM_FEE}</span></div>
              {discount > 0 && <div className="bill-row" style={{ color: 'var(--color-accent)' }}><span>🎁 Coupon Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
              <div className="bill-row total"><span>To Pay</span><span>₹{total.toFixed(2)}</span></div>

              <button
                id="proceed-to-checkout"
                className="btn btn-primary w-full"
                style={{ marginTop: '1.5rem', padding: '1rem', fontSize: '1rem' }}
                onClick={() => navigate('/checkout', { state: { total, discount, couponCode: appliedCoupon?.code, deliveryFee: DELIVERY_FEE, platformFee: PLATFORM_FEE } })}
              >
                Proceed to Checkout →
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                🔒 Secure checkout
              </p>
            </div>

            {/* Offers hint */}
            <div style={{ background: 'var(--color-secondary-bg)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginTop: '1rem', border: '1px dashed var(--color-secondary)' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                🎁 Use code <strong>FIRST50</strong> for 50% off on your first order!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
