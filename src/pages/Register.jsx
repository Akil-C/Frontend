import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { registerUser, loginUser } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Field component defined outside the Register component to prevent focus loss on typing
const Field = ({ id, label, icon, type, name, placeholder, autoComplete, rightIcon, value, onChange, error }) => (
  <div className="form-group">
    <label className="form-label" htmlFor={id}>{label}</label>
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} aria-hidden="true">
        {icon}
      </span>
      <input
        id={id}
        className={`form-input ${error ? 'error' : ''}`}
        style={{ paddingLeft: '2.5rem', paddingRight: rightIcon ? '2.75rem' : undefined }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
      />
      {rightIcon}
    </div>
    {error && <p className="form-error" id={`${id}-error`} role="alert"><FiAlertCircle size={12} /> {error}</p>}
  </div>
);

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (form.phone && !/^\+?[0-9]{7,15}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Invalid phone number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setErrors({});
    try {
      const payload = { name: form.name, email: form.email, phone: form.phone, password: form.password };
      await registerUser(payload);
      
      // Auto-login after successful registration
      const loginRes = await loginUser({ email: form.email, password: form.password });
      const { user, accessToken, refreshToken } = loginRes.data.data;
      login(user, accessToken, refreshToken);
      
      toast.success(`Welcome to PrimeBites, ${user.name}! 🎉`);
      navigate('/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const PasswordStrength = ({ password }) => {
    if (!password) return null;
    const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#E23744', '#FC8019', '#FFB800', '#2EC4B6'];
    return (
      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= score ? colors[score] : 'var(--color-border)', transition: 'background 0.3s' }} />
          ))}
        </div>
        {score > 0 && <p style={{ fontSize: '0.75rem', color: colors[score], marginTop: '0.25rem' }}>{labels[score]} password</p>}
      </div>
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-left" aria-hidden="true">
        <div style={{ textAlign: 'center', color: '#fff', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🍕</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            Join PrimeBites
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 320, lineHeight: 1.7 }}>
            Create your free account and enjoy amazing food from hundreds of restaurants near you.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: 280, margin: '2.5rem auto 0' }}>
            {['✅ Free to join', '🎁 First order discount', '📍 Real-time tracking', '🛡️ Safe & Secure'].map(f => (
              <div key={f} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem' }}>{f}</div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', top: '10%', right: '15%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(252,128,25,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(226,55,68,0.1)', pointerEvents: 'none' }} />
      </div>

      <div className="auth-right" style={{ padding: '2rem 3rem', overflowY: 'auto' }}>
        <div className="auth-form-box">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
            🍕 PrimeBites
          </Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Sign up to start ordering great food</p>

          {errors.general && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(226,55,68,0.08)', borderRadius: '0.5rem', color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              <FiAlertCircle /> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field 
                id="reg-name" 
                label="Full Name" 
                icon={<FiUser size={16} />} 
                type="text" 
                name="name" 
                placeholder="John Doe" 
                autoComplete="name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                error={errors.name}
              />
              <Field 
                id="reg-email" 
                label="Email Address" 
                icon={<FiMail size={16} />} 
                type="email" 
                name="email" 
                placeholder="you@example.com" 
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                error={errors.email}
              />
              <Field 
                id="reg-phone" 
                label="Phone Number (Optional)" 
                icon={<FiPhone size={16} />} 
                type="tel" 
                name="phone" 
                placeholder="+91 98765 43210" 
                autoComplete="tel"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                error={errors.phone}
              />

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} aria-hidden="true" />
                  <input
                    id="reg-password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    autoComplete="new-password"
                  />
                  <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} onClick={() => setShowPassword(p => !p)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
                {errors.password && <p className="form-error" role="alert"><FiAlertCircle size={12} /> {errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} aria-hidden="true" />
                  <input
                    id="reg-confirm"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    autoComplete="new-password"
                  />
                  <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} onClick={() => setShowConfirm(p => !p)} aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <FiCheckCircle size={12} /> Passwords match
                  </p>
                )}
                {errors.confirmPassword && <p className="form-error" role="alert"><FiAlertCircle size={12} /> {errors.confirmPassword}</p>}
              </div>

              <button
                id="register-submit"
                type="submit"
                className="btn btn-primary w-full"
                style={{ padding: '0.875rem', fontSize: '1rem', marginTop: '0.25rem' }}
                disabled={loading}
              >
                {loading ? <><span className="spinner spinner-sm" /> Creating account...</> : 'Create Account 🚀'}
              </button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
