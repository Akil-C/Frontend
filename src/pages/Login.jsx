import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { loginUser } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setErrors({});
    try {
      const res = await loginUser(form);
      const { user, accessToken, refreshToken } = res.data.data;
      login(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.name}! 🎉`);
      navigate(user.roles?.includes('ROLE_ADMIN') ? '/admin' : '/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className="auth-left" aria-hidden="true">
        <div style={{ textAlign: 'center', color: '#fff', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🍔</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Hungry?
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.75)', maxWidth: 320 }}>
            Your favourite food is just a few clicks away. Sign in and start ordering!
          </p>
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 280, margin: '3rem auto 0' }}>
            {['🍕 500+ Restaurants', '⚡ 30 min delivery', '🎁 Exclusive offers', '🔒 Secure payments'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem' }}>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Background decorative circles */}
        <div style={{ position: 'absolute', top: '10%', right: '15%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(252,128,25,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(226,55,68,0.1)', pointerEvents: 'none' }} />
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '2rem' }}>
            🍕 PrimeBites
          </Link>
          <h1 className="auth-title">Welcome back!</h1>
          <p className="auth-subtitle">Sign in to continue ordering</p>

          {errors.general && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(226,55,68,0.08)', borderRadius: '0.5rem', color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              <FiAlertCircle aria-hidden="true" /> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Login form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} aria-hidden="true" />
                  <input
                    id="login-email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    style={{ paddingLeft: '2.5rem' }}
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    autoComplete="email"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && <p className="form-error" id="email-error" role="alert"><FiAlertCircle size={12} /> {errors.email}</p>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} aria-hidden="true" />
                  <input
                    id="login-password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    autoComplete="current-password"
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="form-error" id="password-error" role="alert"><FiAlertCircle size={12} /> {errors.password}</p>}
              </div>

              <button
                id="login-submit"
                type="submit"
                className="btn btn-primary w-full"
                style={{ padding: '0.875rem', fontSize: '1rem' }}
                disabled={loading}
              >
                {loading ? <><span className="spinner spinner-sm" /> Signing in...</> : 'Sign In 🚀'}
              </button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Don't have an account? <Link to="/register" className="auth-link">Create one free</Link>
          </p>

          {/* Demo credentials hint */}
          <div style={{ marginTop: '1.5rem', padding: '0.875rem', background: 'var(--color-bg-alt)', borderRadius: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            <strong>Demo:</strong> admin@fooddelivery.com / password (Admin) <br />
            Or: john@gmail.com / password
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
