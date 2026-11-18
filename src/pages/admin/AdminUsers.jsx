import { useState, useEffect } from 'react';
import { FiShield, FiUserCheck, FiUserX, FiActivity, FiSearch, FiX, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { getAllUsers, updateUserStatus, updateUserRole, getUserLogins } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Tracking modal state
  const [selectedUserForTracking, setSelectedUserForTracking] = useState(null);
  const [userLogins, setUserLogins] = useState([]);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const { toast } = useToast();

  const fetchUsers = async (pg = 0) => {
    setLoading(true);
    try {
      const res = await getAllUsers({ page: pg, size: 25 });
      setUsers(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 0);
      setPage(pg);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus = !user.isActive;
    setActionLoadingId(user.id);
    try {
      await updateUserStatus(user.id, nextStatus);
      toast.success(`User "${user.name}" ${nextStatus ? 'activated' : 'deactivated'} successfully`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: nextStatus } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleRole = async (user) => {
    const isAdmin = user.roles?.some(r => r.name === 'ROLE_ADMIN' || r.name === 'ADMIN');
    const targetRole = isAdmin ? 'ROLE_CUSTOMER' : 'ROLE_ADMIN';
    const actionLabel = isAdmin ? 'revoked from Admin' : 'authorized as Admin';

    setActionLoadingId(user.id);
    try {
      await updateUserRole(user.id, targetRole);
      toast.success(`User "${user.name}" ${actionLabel}`);
      fetchUsers(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenTracking = async (user) => {
    setSelectedUserForTracking(user);
    setTrackingLoading(true);
    setUserLogins([]);
    try {
      const res = await getUserLogins(user.id);
      setUserLogins(res.data.data || []);
    } catch {
      toast.error('Failed to load user activity audit');
    } finally {
      setTrackingLoading(false);
    }
  };

  // Filtered view
  const filteredUsers = users.filter(u => {
    const matchesSearch = !search.trim() || 
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.isActive) ||
      (statusFilter === 'DEACTIVATED' && !u.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar active="users" />
      <div className="admin-content">
        <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              User Authorization & Tracking
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '2px' }}>
              Authorize platform roles, manage account security status, and monitor authentication activity.
            </p>
          </div>
        </header>

        <main className="admin-page">
          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search user by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-card)',
                  color: 'var(--color-text)',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status:</span>
              {['ALL', 'ACTIVE', 'DEACTIVATED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {st.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : (
            <>
              <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>ID</th>
                      <th>User Info</th>
                      <th>Contact Details</th>
                      <th>Assigned Roles</th>
                      <th>Account Status</th>
                      <th style={{ textAlign: 'center' }}>Advanced Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                          No users found matching your search or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => {
                        const isAdmin = u.roles?.some(r => r.name === 'ROLE_ADMIN' || r.name === 'ADMIN');
                        const isBusy = actionLoadingId === u.id;

                        return (
                          <tr key={u.id}>
                            <td style={{ fontWeight: 700, color: 'var(--color-text-muted)' }}>#{u.id}</td>
                            <td>
                              <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{u.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{u.email}</div>
                            </td>
                            <td>
                              <div>{u.phone || <span style={{ color: 'var(--color-text-muted)' }}>N/A</span>}</div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                {u.roles && u.roles.length > 0 ? (
                                  u.roles.map(r => {
                                    const rName = r.name.replace('ROLE_', '');
                                    const isAdm = rName === 'ADMIN';
                                    return (
                                      <span
                                        key={r.id || r.name}
                                        className={`badge ${isAdm ? 'badge-primary' : 'badge-outline'}`}
                                        style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}
                                      >
                                        {isAdm && <FiShield style={{ marginRight: '3px' }} />}
                                        {rName}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span className="badge badge-outline" style={{ fontSize: '0.72rem' }}>CUSTOMER</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${u.isActive ? 'badge-success' : 'badge-nonveg'}`}>
                                {u.isActive ? 'Active' : 'Suspended'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                                {/* Track Activity Button */}
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() => handleOpenTracking(u)}
                                  title="View user login security audit & activity"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                                >
                                  <FiActivity />
                                  <span>Track</span>
                                </button>

                                {/* Role Authorize Button */}
                                <button
                                  className={`btn btn-sm ${isAdmin ? 'btn-outline' : 'btn-primary'}`}
                                  onClick={() => handleToggleRole(u)}
                                  disabled={isBusy}
                                  title={isAdmin ? 'Revoke admin privilege' : 'Authorize as admin'}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.78rem',
                                    borderColor: isAdmin ? 'var(--color-error)' : undefined,
                                    color: isAdmin ? 'var(--color-error)' : undefined
                                  }}
                                >
                                  <FiShield />
                                  <span>{isAdmin ? 'Revoke Admin' : 'Make Admin'}</span>
                                </button>

                                {/* Activate / Deactivate Toggle Button */}
                                <button
                                  className={`btn btn-sm ${u.isActive ? 'btn-outline' : 'btn-success'}`}
                                  onClick={() => handleToggleStatus(u)}
                                  disabled={isBusy}
                                  title={u.isActive ? 'Suspend account access' : 'Activate user account'}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.78rem',
                                    borderColor: u.isActive ? 'var(--color-error)' : undefined,
                                    color: u.isActive ? 'var(--color-error)' : undefined
                                  }}
                                >
                                  {u.isActive ? <FiUserX /> : <FiUserCheck />}
                                  <span>{u.isActive ? 'Suspend' : 'Activate'}</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={() => fetchUsers(page - 1)} disabled={page === 0}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} className={`page-btn ${page === i ? 'active' : ''}`} onClick={() => fetchUsers(i)}>{i + 1}</button>
                  ))}
                  <button className="page-btn" onClick={() => fetchUsers(page + 1)} disabled={page === totalPages - 1}>›</button>
                </div>
              )}
            </>
          )}

          {/* User Activity Tracking Modal */}
          {selectedUserForTracking && (
            <div className="modal-backdrop" onClick={() => setSelectedUserForTracking(null)}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '640px', width: '90%', padding: '1.75rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                      <FiActivity size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                        Login Activity: {selectedUserForTracking.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {selectedUserForTracking.email} &bull; User ID: #{selectedUserForTracking.id}
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => setSelectedUserForTracking(null)}
                    aria-label="Close activity modal"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {trackingLoading ? (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <div className="spinner" />
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Fetching security logs...</p>
                  </div>
                ) : userLogins.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-background-alt)', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>No login activity recorded for this user yet.</p>
                  </div>
                ) : (
                  <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)' }}>
                    <table className="data-table" style={{ fontSize: '0.85rem' }}>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>IP Address</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userLogins.map(lh => (
                          <tr key={lh.id}>
                            <td>{new Date(lh.loginTime).toLocaleString()}</td>
                            <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{lh.ipAddress || '127.0.0.1'}</td>
                            <td>
                              <span className={`badge ${lh.status === 'SUCCESS' ? 'badge-success' : 'badge-nonveg'}`}>
                                {lh.status === 'SUCCESS' ? <FiCheck style={{ marginRight: '3px' }} /> : <FiAlertTriangle style={{ marginRight: '3px' }} />}
                                {lh.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                  <button className="btn btn-outline" onClick={() => setSelectedUserForTracking(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
