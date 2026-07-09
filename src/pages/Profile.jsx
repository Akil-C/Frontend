import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { getMyProfile, updateMyProfile } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, loadUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name cannot be empty'); return; }
    setLoading(true);
    try {
      await updateMyProfile(form);
      await loadUser();
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const NAV_ITEMS = [
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'orders', label: 'My Orders', icon: '📦', link: '/orders' },
    { id: 'favorites', label: 'Favorites', icon: '❤️', link: '/favorites' },
    { id: 'addresses', label: 'Saved Addresses', icon: '📍' },
  ];

  return (
    <div className="page-enter">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.75rem' }}>
          My Account
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-sidebar-header">
              <div className="profile-avatar" aria-label="User avatar">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{user?.name}</h2>
              <p style={{ fontSize: '0.8125rem', opacity: 0.85 }}>{user?.email}</p>
            </div>
            <nav className="profile-nav" aria-label="Profile navigation">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  className={`profile-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => item.link ? navigate(item.link) : setActiveTab(item.id)}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span> {item.label}
                </button>
              ))}
              <button className="profile-nav-item danger" onClick={handleLogout} style={{ marginTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                <span aria-hidden="true">🚪</span> Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main>
            {activeTab === 'profile' && (
              <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>Personal Information</h2>
                  {!editing ? (
                    <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)} id="edit-profile-btn" aria-label="Edit profile">
                      <FiEdit2 size={14} /> Edit
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading} aria-label="Save changes">
                        {loading ? <span className="spinner spinner-sm" /> : <><FiSave size={14} /> Save</>}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone || '' }); }} aria-label="Cancel editing">
                        <FiX size={14} /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-name">
                      <FiUser size={14} style={{ marginRight: '0.375rem' }} aria-hidden="true" /> Full Name
                    </label>
                    {editing ? (
                      <input id="profile-name" className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    ) : (
                      <p style={{ padding: '0.75rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', fontSize: '0.9375rem', fontWeight: 500 }}>
                        {user?.name}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-email">
                      <FiMail size={14} style={{ marginRight: '0.375rem' }} aria-hidden="true" /> Email Address
                    </label>
                    <p style={{ padding: '0.75rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                      {user?.email} <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700 }}>✓ Verified</span>
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-phone">
                      <FiPhone size={14} style={{ marginRight: '0.375rem' }} aria-hidden="true" /> Phone Number
                    </label>
                    {editing ? (
                      <input id="profile-phone" className="form-input" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                    ) : (
                      <p style={{ padding: '0.75rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', fontSize: '0.9375rem', fontWeight: 500 }}>
                        {user?.phone || <span style={{ color: 'var(--color-text-muted)' }}>Not provided</span>}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Account Type</label>
                    <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 0' }}>
                      {user?.roles?.map(role => (
                        <span key={role} className="badge badge-primary">{role.replace('ROLE_', '')}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Saved Addresses</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Manage your saved addresses in the Checkout page.</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/cart')}>
                  Go to Checkout
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
