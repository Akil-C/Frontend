import { useState, useEffect } from 'react';
import { FiSlash, FiCheck } from 'react-icons/fi';
import { getAllUsers } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  const fetchUsers = async (pg) => {
    setLoading(true);
    try {
      const res = await getAllUsers({ page: pg, size: 20 });
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

  return (
    <div className="admin-layout">
      <AdminSidebar active="users" />
      <div className="admin-content">
        <header className="admin-header">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Manage Users</h1>
        </header>

        <main className="admin-page">
          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : (
            <>
              <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || <span style={{ color: 'var(--color-text-muted)' }}>N/A</span>}</td>
                        <td>
                          <span className={`badge ${u.isActive ? 'badge-success' : 'badge-nonveg'}`}>
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                      </tr>
                    ))}
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
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
