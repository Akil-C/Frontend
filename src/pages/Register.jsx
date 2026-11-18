import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { registerUser, loginUser } from '../services/apiService';
import { API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const REGISTER_PREVIEWS = [
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
];

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'PLEASE ENTER YOUR FULL NAME';
    else if (form.name.trim().length < 2) errs.name = 'NAME MUST BE AT LEAST 2 CHARACTERS';
    if (!form.email) errs.email = 'PLEASE ENTER YOUR EMAIL ADDRESS';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'PLEASE ENTER A VALID EMAIL FORMAT';
    if (!form.phone.trim()) errs.phone = 'PLEASE ENTER YOUR PHONE NUMBER';
    else if (form.phone.replace(/[^0-9]/g, '').length < 7)
      errs.phone = 'PLEASE ENTER A VALID PHONE NUMBER (AT LEAST 7 DIGITS)';
    if (!form.password) errs.password = 'PLEASE ENTER A PASSWORD';
    else if (form.password.length < 6) errs.password = 'PASSWORD MUST BE AT LEAST 6 CHARACTERS';
    if (!form.confirmPassword) errs.confirmPassword = 'PLEASE CONFIRM YOUR PASSWORD';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'PASSWORDS DO NOT MATCH';
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
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      };
      await registerUser(payload);

      // Auto-login after successful registration
      const loginRes = await loginUser({ email: form.email.trim(), password: form.password });
      const { user, accessToken, refreshToken } = loginRes.data.data;
      login(user, accessToken, refreshToken);

      toast.success(`Welcome to Prime Bites, ${user.name}! 🎉`);
      navigate('/home');
    } catch (err) {
      let msg = err.response?.data?.message;
      if (!msg) {
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          msg = 'Backend server is waking up from Render sleep (~30-50s). Please wait a few seconds and try again!';
        } else if (!err.response) {
          msg = `Cannot reach backend at ${API_BASE_URL}. If the backend is waking up on Render, please retry in a few seconds.`;
        } else if (err.response.status === 502 || err.response.status === 503) {
          msg = 'Backend server is starting up or temporarily unavailable on Render. Please retry in a few moments.';
        } else {
          msg = `Registration failed (${err.response?.status || 'error'}). Please try again.`;
        }
      }
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
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
            <span className="editorial-auth-tagline">JOIN PRIME BITES</span>
            <h1 className="editorial-auth-headline">
              GREAT FOOD,<br />DELIVERED.
            </h1>
            <p className="editorial-auth-desc">
              Create your account in seconds to order from top restaurants, track orders in real time,
              and unlock exclusive discounts.
            </p>

            {/* Micro gallery preview */}
            <div className="editorial-auth-curated-preview">
              {REGISTER_PREVIEWS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Delicious food"
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
            <span className="editorial-form-pretitle">GET STARTED</span>
            <h2 className="editorial-form-title">REGISTER</h2>
            <p className="editorial-form-subtitle">FILL IN YOUR DETAILS TO CREATE AN ACCOUNT</p>
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

          <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
            {/* Full Name */}
            <div className="editorial-input-group">
              <label className="editorial-input-label" htmlFor="register-name">
                FULL NAME
              </label>
              <div className="editorial-input-wrap">
                <FiUser className="editorial-input-icon" aria-hidden="true" />
                <input
                  id="register-name"
                  className={`editorial-text-input ${errors.name ? 'error' : ''}`}
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && (
                <div className="editorial-input-error" role="alert">
                  <FiAlertCircle size={12} /> {errors.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="editorial-input-group">
              <label className="editorial-input-label" htmlFor="register-email">
                EMAIL ADDRESS
              </label>
              <div className="editorial-input-wrap">
                <FiMail className="editorial-input-icon" aria-hidden="true" />
                <input
                  id="register-email"
                  className={`editorial-text-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  placeholder="john@example.com"
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

            {/* Phone */}
            <div className="editorial-input-group">
              <label className="editorial-input-label" htmlFor="register-phone">
                PHONE NUMBER
              </label>
              <div className="editorial-input-wrap">
                <FiPhone className="editorial-input-icon" aria-hidden="true" />
                <input
                  id="register-phone"
                  className={`editorial-text-input ${errors.phone ? 'error' : ''}`}
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                />
              </div>
              {errors.phone && (
                <div className="editorial-input-error" role="alert">
                  <FiAlertCircle size={12} /> {errors.phone}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="editorial-input-group">
              <label className="editorial-input-label" htmlFor="register-password">
                PASSWORD
              </label>
              <div className="editorial-input-wrap">
                <FiLock className="editorial-input-icon" aria-hidden="true" />
                <input
                  id="register-password"
                  className={`editorial-text-input ${errors.password ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="editorial-input-group">
              <label className="editorial-input-label" htmlFor="register-confirm">
                CONFIRM PASSWORD
              </label>
              <div className="editorial-input-wrap">
                <FiLock className="editorial-input-icon" aria-hidden="true" />
                <input
                  id="register-confirm"
                  className={`editorial-text-input ${errors.confirmPassword ? 'error' : ''}`}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  className="editorial-password-toggle"
                  onClick={() => setShowConfirm((p) => !p)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="editorial-input-error" role="alert">
                  <FiAlertCircle size={12} /> {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="register-submit"
              type="submit"
              className="editorial-auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
            </button>
          </form>

          {/* Link to Login */}
          <div className="editorial-auth-switch">
            <span>ALREADY HAVE AN ACCOUNT?</span>
            <Link to="/login" className="editorial-auth-switch-link">
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
