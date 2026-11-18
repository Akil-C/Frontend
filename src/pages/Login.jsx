import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { loginUser } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LOGIN_PREVIEWS = [
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80',
];

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'EMAIL IS REQUIRED';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'INVALID EMAIL FORMAT';
    if (!form.password) errs.password = 'PASSWORD IS REQUIRED';
    else if (form.password.length < 6) errs.password = 'MINIMUM 6 CHARACTERS REQUIRED';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const res = await loginUser(form);
      const { user, accessToken, refreshToken } = res.data.data;
      login(user, accessToken, refreshToken);
      toast.success(`WELCOME BACK, ${user.name.toUpperCase()}!`);
      navigate(user.roles?.includes('ROLE_ADMIN') ? '/admin' : '/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Please verify your credentials.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email, password) => {
    setForm({ email, password });
    setErrors({});
  };

  return (
    <div className="editorial-auth-wrapper">
      <div className="editorial-auth-card">
        {/* Left Editorial Showcase Panel */}
        <div className="editorial-auth-showcase">
          <div className="editorial-auth-showcase-bg-circle" />

          {/* Logo */}
          <Link to="/" className="editorial-auth-brand" aria-label="Prime Bites Home">
            <span>-</span> PRIME BITES
          </Link>

          {/* Middle Hero */}
          <div className="editorial-auth-hero-text">
            <span className="editorial-auth-tagline">PATRON ACCESS PORTAL</span>
            <h1 className="editorial-auth-headline">
              SAVOR THE<br />TERROIR.
            </h1>
            <p className="editorial-auth-desc">
              Curated gastronomy from Michelin-caliber kitchens, regenerative biodynamic estates, and
              private cellars, delivered with immaculate dispatch.
            </p>

            {/* Micro gallery preview */}
            <div className="editorial-auth-curated-preview">
              {LOGIN_PREVIEWS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Curated plate"
                  className="editorial-auth-img-thumb"
                />
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="editorial-auth-stats">
            <div className="editorial-auth-stat-item">
              <span className="editorial-auth-stat-num">500+</span>
              <span className="editorial-auth-stat-label">CURATED ESTATES</span>
            </div>
            <div className="editorial-auth-stat-item">
              <span className="editorial-auth-stat-num">25m</span>
              <span className="editorial-auth-stat-label">DISPATCH SPEED</span>
            </div>
            <div className="editorial-auth-stat-item">
              <span className="editorial-auth-stat-num">100%</span>
              <span className="editorial-auth-stat-label">ORGANIC PROVENANCE</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="editorial-auth-form-side">
          <div className="editorial-auth-form-header">
            <span className="editorial-form-pretitle">WELCOME BACK</span>
            <h2 className="editorial-form-title">SIGN IN</h2>
            <p className="editorial-form-subtitle">ENTER YOUR GASTRONOMIC CREDENTIALS</p>
          </div>

          {errors.general && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.9rem 1.25rem',
                background: 'rgba(158, 42, 43, 0.08)',
                borderRadius: '1rem',
                color: '#9e2a2b',
                fontFamily: 'Inter',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: '1.5rem',
                border: '1px solid rgba(158, 42, 43, 0.2)',
              }}
            >
              <FiAlertCircle size={16} aria-hidden="true" />
              <span>{errors.general.toUpperCase()}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Sign In form">
            {/* Email Field */}
            <div className="editorial-input-group">
              <label className="editorial-input-label" htmlFor="login-email">
                CORRESPONDENCE EMAIL
              </label>
              <div className="editorial-input-wrap">
                <FiMail className="editorial-input-icon" aria-hidden="true" />
                <input
                  id="login-email"
                  className={`editorial-text-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  placeholder="PATRON@ESTATE.COM"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <div className="editorial-input-error" role="alert">
                  <FiAlertCircle size={12} /> {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="editorial-input-group">
              <label className="editorial-input-label" htmlFor="login-password">
                ACCESS KEY CODE
              </label>
              <div className="editorial-input-wrap">
                <FiLock className="editorial-input-icon" aria-hidden="true" />
                <input
                  id="login-password"
                  className={`editorial-text-input ${errors.password ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  className="editorial-password-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="editorial-input-error" role="alert">
                  <FiAlertCircle size={12} /> {errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              className="editorial-auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'AUTHENTICATING...' : 'ENTER DISPATCH →'}
            </button>
          </form>

          {/* Quick Fill Demo Badges */}
          <div className="editorial-demo-strip">
            <span className="editorial-demo-title">TEST CREDENTIALS (CLICK TO FILL)</span>
            <div className="editorial-demo-pills">
              <button
                type="button"
                className="editorial-demo-pill"
                onClick={() => handleQuickFill('admin@fooddelivery.com', 'password')}
              >
                ADMIN PATRON
              </button>
              <button
                type="button"
                className="editorial-demo-pill"
                onClick={() => handleQuickFill('john@gmail.com', 'password')}
              >
                MEMBER PATRON
              </button>
            </div>
          </div>

          {/* Link to Register */}
          <div className="editorial-auth-switch">
            <span>NEW PATRON?</span>
            <Link to="/register" className="editorial-auth-switch-link">
              REQUEST MEMBERSHIP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
