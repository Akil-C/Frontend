import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setForm({ name: '', description: '', imageUrl: '' });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      imageUrl: cat.imageUrl || ''
    });
    setEditingId(cat.id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
        toast.success('Category updated successfully');
      } else {
        await createCategory(form);
        toast.success('Category created successfully');
      }
      setModalOpen(false);
      fetchCategories();
    } catch {
      toast.error('Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="categories" />
      <div className="admin-content">
        <header className="admin-header">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Manage Categories</h1>
          <button className="btn btn-primary" onClick={openCreateModal} id="add-category-btn">
            <FiPlus /> Add Category
          </button>
        </header>

        <main className="admin-page">
          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : (
            <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td>
                        <img
                          src={cat.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&auto=format&fit=crop'}
                          alt={cat.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&auto=format&fit=crop'; }}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{cat.name}</td>
                      <td>{cat.description || <span style={{ color: 'var(--color-text-muted)' }}>No description</span>}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditModal(cat)} aria-label="Edit category">
                            <FiEdit />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(cat.id)} aria-label="Delete category">
                            <FiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Category' : 'Add Category'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-label="Category management form">
            <div className="form-group">
              <label className="form-label" htmlFor="cat-name">Category Name *</label>
              <input id="cat-name" className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cat-desc">Description</label>
              <textarea id="cat-desc" className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cat-image">Image URL</label>
              <input id="cat-image" className="form-input" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://unsplash.com/..." />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? <span className="spinner spinner-sm" /> : 'Save Category'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCategories;
