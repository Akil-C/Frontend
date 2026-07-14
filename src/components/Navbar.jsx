import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMapPin, FiSun, FiMoon, FiMenu, FiX, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.svg';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
    setProfileOpen(false);
    setMobileOpen(false);
  };

  const location = localStorage.getItem('deliveryLocation') || 'Select Location';

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="Prime Bites Home">
          <img src={logo} alt="Prime Bites" className="logo-image" />
        </Link>

        {/* Location */}
        <div
          className="navbar-location"
          onClick={() => navigate(user ? '/select-location' : '/login')}
          role="button"
          aria-label="Select delivery location"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/select-location')}
        >
          <FiMapPin color="var(--color-primary)" size={14} />
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text)' }}>Deliver to</div>
            <div className="navbar-location-text">{location}</div>
          </div>
        </div>

        {/* Search */}
        <div className="navbar-search" style={{ position: 'relative' }}>
          <FiSearch className="navbar-search-icon" aria-hidden="true" />
          <input
            id="navbar-search"
            className="navbar-search-input"
            type="search"
            placeholder="Search restaurants, dishes..."
            aria-label="Search restaurants and dishes"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
              }
            }}
          />
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title="Toggle theme"
          >
            {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>

          {/* Offers Link */}
          <Link to="/offers" className="btn btn-ghost" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Offers
          </Link>

          {user ? (
            <>
              {/* Cart Button */}
              <Link to="/cart" className="navbar-cart-btn" id="cart-button" aria-label={`Cart with ${cartCount} items`}>
                <FiShoppingCart size={18} aria-hidden="true" />
                Cart
                {cartCount > 0 && (
                  <span className="cart-count" aria-label={`${cartCount} items in cart`}>{cartCount}</span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => setProfileOpen(prev => !prev)}
                  aria-label="User menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '0.875rem'
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
                {profileOpen && (
                  <div style={{
                    position: 'absolute', top: '110%', right: 0,
                    background: 'var(--color-card)', borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)',
                    minWidth: 200, zIndex: 'var(--z-dropdown)', padding: '0.5rem 0'
                  }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border-light)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{user.email}</div>
                    </div>
                    {[
                      { label: 'My Profile', path: '/profile', icon: '👤' },
                      { label: 'My Orders', path: '/orders', icon: '📦' },
                      { label: 'Favorites', path: '/favorites', icon: '❤️' },
                      ...(isAdmin() ? [{ label: 'Admin Panel', path: '/admin', icon: '⚙️' }] : []),
                    ].map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.625rem 1rem', fontSize: '0.875rem',
                          color: 'var(--color-text)', transition: 'background 0.15s'
                        }}
                        onClick={() => setProfileOpen(false)}
                        onMouseOver={e => e.currentTarget.style.background = 'var(--color-bg-alt)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span>{item.icon}</span> {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.625rem 1rem', fontSize: '0.875rem',
                        color: 'var(--color-error)', width: '100%',
                        borderTop: '1px solid var(--color-border-light)', marginTop: '0.5rem'
                      }}
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ fontWeight: 600 }}>Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'var(--color-card)', borderTop: '1px solid var(--color-border)',
          padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'
        }}>
          <input
            className="form-input"
            type="search"
            placeholder="Search restaurants, dishes..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
                setMobileOpen(false);
              }
            }}
          />
          <Link to="/offers" onClick={() => setMobileOpen(false)} style={{ fontWeight: 600, color: 'var(--color-text)' }}>
            🎁 Offers
          </Link>
          {user ? (
            <>
              <Link to="/cart" onClick={() => setMobileOpen(false)} style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                🛒 Cart ({cartCount})
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ fontWeight: 600, color: 'var(--color-text)' }}>👤 Profile</Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)} style={{ fontWeight: 600, color: 'var(--color-text)' }}>📦 Orders</Link>
              <button onClick={handleLogout} style={{ fontWeight: 600, color: 'var(--color-error)', textAlign: 'left' }}>🚪 Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
