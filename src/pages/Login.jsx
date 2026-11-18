import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
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
    if (!form.email) errs.email = 'PLEASE ENTER YOUR EMAIL ADDRESS';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'PLEASE ENTER A VALID EMAIL FORMAT';
    if (!form.password) errs.password = 'PLEASE ENTER YOUR PASSWORD';
    else if (form.password.length < 6) errs.password = 'PASSWORD MUST BE AT LEAST 6 CHARACTERS';
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
      toast.success(`Welcome back, ${user.name}! 🎉`);
      navigate(user.roles?.includes('ROLE_ADMIN') ? '/admin' : '/home');
    } catch (err) {
      let msg = err.response?.data?.message;
      if (!msg) {
        if (!err.response) {
          msg = 'Cannot connect to backend server. Please verify the backend is running on Render and VITE_API_BASE_URL is set.';
        } else if (err.response.status === 502 || err.response.status === 503) {
          msg = 'Backend server is starting up or crashed on Render (Check Render logs).';
        } else if (err.response.status === 401 || err.response.status === 400) {
          msg = 'Invalid email or password. Please verify credentials.';
        } else {
          msg = `Server error (${err.response.status}). Please check server logs.`;
        }
      }
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
        {/* Left Showcase Panel */}
        <div className="editorial-auth-showcase">
          <div className="editorial-auth-showcase-bg-circle" />

          {/* Logo */}
          <Link to="/" className="editorial-auth-brand" aria-label="Prime Bites Home">
            <span>-</span> PRIME BITES
          </Link>

          {/* Middle Hero */}
          <div className="editorial-auth-hero-text">
            <span className="editorial-auth-tagline">FAST FOOD DELIVERY</span>
            <h1 className="editorial-auth-headline">
              HUNGRY?<br />ORDER NOW.
            </h1>
            <p className="editorial-auth-desc">
              Enjoy freshly cooked meals from top local restaurants, delivered hot and fast
              right to your doorstep.
            </p>

            {/* Food gallery preview */}
            <div className="editorial-auth-curated-preview">
              {LOGIN_PREVIEWS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Popular dish"
                  className="editorial-auth-img-thumb"
                />
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="editorial-auth-stats">
            <div className="editorial-auth-stat-item">
              <span className="editorial-auth-stat-num">500+</span>
              <span className="editorial-auth-stat-label">RESTAURANTS</span>
            </div>
            <div className="editorial-auth-stat-item">
              <span className="editorial-auth-stat-num">30 MIN</span>
              <span className="editorial-auth-stat-label">AVG. DELIVERY</span>
            </div>
            <div className="editorial-auth-stat-item">
              <span className="editorial-auth-stat-num">100%</span>
              <span className="editorial-auth-stat-label">FRESH & SAFE</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="editorial-auth-form-side">
          <div className="editorial-auth-form-header">
            <span className="editorial-form-pretitle">WELCOME BACK</span>
            <h2 className="editorial-form-title">SIGN IN</h2>
            <p className="editorial-form-subtitle">ENTER YOUR EMAIL AND PASSWORD TO CONTINUE</p>
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
                letterSpacing: '0.05em',
                marginBottom: '1.5rem',
                border: '1px solid rgba(158, 42, 43, 0.2)',
              }}
            >
              <FiAlertCircle size={16} aria-hidden="true" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Sign In form">
            {/* Email Field */}
            <div className="editorial-input-group">
              <label className="editorial-input-label" htmlFor="login-email">
                EMAIL ADDRESS
              </label>
              <div className="editorial-input-wrap">
                <FiMail className="editorial-input-icon" aria-hidden="true" />
                <input
                  id="login-email"
                  className={`editorial-text-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  placeholder="name@example.com"
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
                PASSWORD
              </label>
              <div className="editorial-input-wrap">
                <FiLock className="editorial-input-icon" aria-hidden="true" />
                <input
                  id="login-password"
                  className={`editorial-text-input ${errors.password ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
              {loading ? 'SIGNING IN...' : 'SIGN IN TO ORDER →'}
            </button>
          </form>

          {/* Quick Fill Demo Badges */}
          <div className="editorial-demo-strip">
            <span className="editorial-demo-title">DEMO TEST ACCOUNTS (CLICK TO AUTO-FILL)</span>
            <div className="editorial-demo-pills">
              <button
                type="button"
                className="editorial-demo-pill"
                onClick={() => handleQuickFill('admin@fooddelivery.com', 'password')}
              >
                ADMIN DEMO
              </button>
              <button
                type="button"
                className="editorial-demo-pill"
                onClick={() => handleQuickFill('john@gmail.com', 'password')}
              >
                CUSTOMER DEMO
              </button>
            </div>
          </div>

          {/* Link to Register */}
          <div className="editorial-auth-switch">
            <span>DON'T HAVE AN ACCOUNT?</span>
            <Link to="/register" className="editorial-auth-switch-link">
              CREATE ONE FREE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
