import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

const CITIES = [
  'Bangalore, Karnataka',
  'Mumbai, Maharashtra',
  'Delhi, NCR',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Pune, Maharashtra',
  'Kolkata, West Bengal',
  'Ahmedabad, Gujarat',
];

const SelectLocation = () => {
  const [customLocation, setCustomLocation] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSelect = (loc) => {
    localStorage.setItem('deliveryLocation', loc);
    toast.success(`Delivery location set to: ${loc}`);
    navigate('/home');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customLocation.trim()) return;
    handleSelect(customLocation.trim());
  };

  return (
    <div className="page-enter">
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: 600 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '3rem' }} aria-hidden="true">📍</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, margin: '0.75rem 0' }}>
            Where should we deliver?
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
            Select your city or enter a custom delivery address to browse menu options.
          </p>
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }} role="search">
          <input
            id="custom-location"
            className="form-input"
            placeholder="Enter your delivery address / area..."
            value={customLocation}
            onChange={e => setCustomLocation(e.target.value)}
            style={{ flex: 1 }}
            aria-label="Custom delivery address"
          />
          <button className="btn btn-primary" type="submit" disabled={!customLocation.trim()}>
            Deliver Here
          </button>
        </form>

        {/* Popular Cities */}
        <section aria-labelledby="cities-heading">
          <h2 id="cities-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
            Popular Cities
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {CITIES.map(city => (
              <button
                key={city}
                onClick={() => handleSelect(city)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem',
                  background: 'var(--color-card)', border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left',
                  fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)',
                  boxShadow: 'var(--shadow-sm)', transition: 'all 0.15s'
                }}
              >
                <FiMapPin color="var(--color-primary)" />
                {city}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SelectLocation;
