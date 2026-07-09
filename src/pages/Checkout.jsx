import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMapPin, FiPlus, FiCheck } from 'react-icons/fi';
import { getAddresses, createAddress } from '../services/apiService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
  { id: 'CARD', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'UPI', label: 'UPI', icon: '📱', desc: 'GPay, PhonePe, BHIM' },
  { id: 'WALLET', label: 'Wallet', icon: '👛', desc: 'PrimeBites Wallet' },
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, cartSubtotal } = useCart();
  const { toast } = useToast();
  const billData = location.state || {};

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [notes, setNotes] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=review
  const [addrForm, setAddrForm] = useState({ label: 'HOME', addressLine1: '', city: '', state: '', pinCode: '', country: 'India' });
  const [loading, setLoading] = useState(false);
  const [addrLoading, setAddrLoading] = useState(true);

  useEffect(() => {
    if (!cart?.items?.length) { navigate('/cart'); return; }
    getAddresses().then(r => {
      const list = r.data.data || [];
      setAddresses(list);
      if (list.length) setSelectedAddress(list[0]);
    }).catch(() => {}).finally(() => setAddrLoading(false));
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addrForm.addressLine1 || !addrForm.city || !addrForm.pinCode) { toast.error('Please fill required address fields'); return; }
    setLoading(true);
    try {
      const payload = {
        label: addrForm.label,
        streetAddress: addrForm.addressLine1,
        city: addrForm.city,
        state: addrForm.state,
        postalCode: addrForm.pinCode,
        isDefault: false
      };
      const res = await createAddress(payload);
      const newAddr = res.data.data;
      setAddresses(prev => [...prev, newAddr]);
      setSelectedAddress(newAddr);
      setShowAddressForm(false);
      toast.success('Address added successfully!');
    } catch { toast.error('Failed to add address'); }
    finally { setLoading(false); }
  };

  const handleProceed = () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    navigate('/payment', {
      state: {
        addressId: selectedAddress.id,
        paymentMethod,
        notes,
        ...billData
      }
    });
  };

  const STEPS = ['Address', 'Payment', 'Review'];

  return (
    <div className="page-enter">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 900 }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>
          Checkout
        </h1>

        {/* Step Progress */}
        <div className="step-progress" aria-label="Checkout steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-item ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
              <div className="step-circle" aria-current={step === i + 1 ? 'step' : undefined}>
                {step > i + 1 ? <FiCheck size={14} /> : i + 1}
              </div>
              <span className="step-label">{s}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          <div>
            {/* Step 1: Address */}
            <section aria-labelledby="address-section" style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
              <h2 id="address-section" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                <FiMapPin /> 1. Delivery Address
              </h2>
              {addrLoading ? (
                <div className="spinner spinner-sm" style={{ margin: '1rem auto' }} />
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    {addresses.map(addr => (
                      <label
                        key={addr.id}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '0.875rem', padding: '1rem',
                          border: `2px solid ${selectedAddress?.id === addr.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                          background: selectedAddress?.id === addr.id ? 'var(--color-primary-bg)' : 'transparent',
                          transition: 'all 0.15s'
                        }}
                      >
                        <input type="radio" name="address" value={addr.id} checked={selectedAddress?.id === addr.id} onChange={() => setSelectedAddress(addr)} style={{ marginTop: '0.125rem' }} aria-label={`Select address: ${addr.streetAddress}`} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ background: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px' }}>{addr.label}</span>
                          </div>
                          <p style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{addr.streetAddress}</p>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{addr.city}, {addr.state} - {addr.postalCode}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {!showAddressForm ? (
                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setShowAddressForm(true)} id="add-address-btn">
                      <FiPlus /> Add New Address
                    </button>
                  ) : (
                    <form onSubmit={handleAddAddress} aria-label="Add new address form">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        {[
                          { label: 'Label', name: 'label', type: 'text', placeholder: 'HOME / WORK' },
                          { label: 'Pin Code *', name: 'pinCode', type: 'text', placeholder: '110001' },
                          { label: 'Address Line 1 *', name: 'addressLine1', type: 'text', placeholder: '123 Main Street', col: 2 },
                          { label: 'City *', name: 'city', type: 'text', placeholder: 'New Delhi' },
                          { label: 'State *', name: 'state', type: 'text', placeholder: 'Delhi' },
                        ].map(f => (
                          <div key={f.name} className="form-group" style={f.col ? { gridColumn: `span ${f.col}` } : {}}>
                            <label className="form-label" htmlFor={`addr-${f.name}`}>{f.label}</label>
                            <input id={`addr-${f.name}`} className="form-input" type={f.type} placeholder={f.placeholder} value={addrForm[f.name]} onChange={e => setAddrForm(p => ({ ...p, [f.name]: e.target.value }))} />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <span className="spinner spinner-sm" /> : 'Save Address'}</button>
                        <button type="button" className="btn btn-ghost" onClick={() => setShowAddressForm(false)}>Cancel</button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </section>

            {/* Step 2: Payment */}
            <section aria-labelledby="payment-section" style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
              <h2 id="payment-section" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                💳 2. Payment Method
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {PAYMENT_METHODS.map(pm => (
                  <label
                    key={pm.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                      border: `2px solid ${paymentMethod === pm.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                      background: paymentMethod === pm.id ? 'var(--color-primary-bg)' : 'transparent',
                      transition: 'all 0.15s'
                    }}
                  >
                    <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} aria-label={`Pay with ${pm.label}`} />
                    <span style={{ fontSize: '1.5rem' }} aria-hidden="true">{pm.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{pm.label}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Order Notes */}
            <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>
                📝 Order Notes (Optional)
              </h2>
              <textarea
                id="order-notes"
                className="form-input"
                placeholder="Add any special instructions for the restaurant or delivery..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                style={{ resize: 'vertical' }}
                aria-label="Order special instructions"
              />
            </div>
          </div>

          {/* Bill Summary */}
          <aside>
            <div className="bill-summary" aria-label="Order summary">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>
              {(cart?.items || []).map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.375rem 0', color: 'var(--color-text-secondary)' }}>
                  <span>{item.food?.name} × {item.quantity}</span>
                  <span>₹{(item.food?.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="bill-row" style={{ marginTop: '0.5rem' }}><span>Item Total</span><span>₹{cartSubtotal.toFixed(2)}</span></div>
              <div className="bill-row"><span>Delivery</span><span>₹{billData.deliveryFee || 40}</span></div>
              <div className="bill-row"><span>Platform Fee</span><span>₹{billData.platformFee || 5}</span></div>
              {billData.discount > 0 && <div className="bill-row" style={{ color: 'var(--color-accent)' }}><span>Discount</span><span>-₹{billData.discount}</span></div>}
              <div className="bill-row total"><span>Total</span><span>₹{billData.total?.toFixed(2) || cartSubtotal.toFixed(2)}</span></div>

              <button
                id="place-order-btn"
                className="btn btn-primary w-full"
                style={{ marginTop: '1.5rem', padding: '1rem', fontSize: '1rem' }}
                onClick={handleProceed}
                disabled={!selectedAddress}
              >
                Proceed to Pay →
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                🔒 Safe & Secure Payment
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
