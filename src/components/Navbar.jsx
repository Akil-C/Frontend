import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userDropdown, setUserDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/');
    setUserDropdown(false);
  };

  return (
    <header className="editorial-navbar" role="banner">
      <div className="editorial-navbar-inner">
        {/* Left: Logo in bold uppercase with a hyphen prefix */}
        <Link to="/" className="editorial-brand-logo" aria-label="Prime Bites Home">
          <span>-</span> PRIME BITES
        </Link>

        {/* Center: Pill-shaped navigation bar with blur and semi-transparent background */}
        <nav className="editorial-pill-nav" aria-label="Primary Navigation">
          <Link to="/" className="editorial-nav-link">HOME</Link>
          <Link to="/home" className="editorial-nav-link">MENU</Link>
          <Link to="/offers" className="editorial-nav-link">OFFERS</Link>
          <Link to="/about" className="editorial-nav-link">ORIGIN</Link>
          <Link to="/search" className="editorial-nav-link">SEARCH</Link>
          {isAdmin && (
            <Link to="/admin" className="editorial-nav-link" style={{ color: '#c27803' }}>
              ADMIN
            </Link>
          )}
        </nav>

        {/* Right: User / Auth & Cart button in a white pill */}
        <div className="editorial-nav-right">
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                className="editorial-pill-btn"
                onClick={() => setUserDropdown(p => !p)}
                aria-label="User account menu"
                aria-expanded={userDropdown}
              >
                <FiUser size={12} />
                <span>{user.name?.split(' ')[0] || 'ACCOUNT'}</span>
              </button>
              {userDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    background: '#ffffff',
                    borderRadius: '1.5rem',
                    boxShadow: '0 20px 40px -10px rgba(1, 71, 46, 0.25)',
                    padding: '1rem',
                    minWidth: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    zIndex: 100,
                    border: '1px solid rgba(1, 71, 46, 0.1)'
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdown(false)}
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: '#01472e',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.75rem',
                      textDecoration: 'none'
                    }}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setUserDropdown(false)}
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: '#01472e',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.75rem',
                      textDecoration: 'none'
                    }}
                  >
                    Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdown(false)}
                      style={{
                        fontFamily: 'Inter',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        color: '#c27803',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.75rem',
                        textDecoration: 'none'
                      }}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: '#9e2a2b',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.75rem',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="editorial-pill-btn">
              SIGN IN
            </Link>
          )}

          {/* Cart button with a numeric counter badge in a white pill */}
          <Link to="/cart" className="editorial-cart-white-pill" aria-label={`Cart with ${cartCount} items`}>
            <span>CART</span>
            <span className="editorial-cart-count-badge">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
