import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import { getFoods, createFood, updateFood, deleteFood, getRestaurants, getCategories } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: 99, isVeg: true, restaurantId: '', categoryId: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fRes, rRes, cRes] = await Promise.all([
        getFoods({ size: 100 }),
        getRestaurants({ size: 100 }),
        getCategories()
      ]);
      setFoods(fRes.data.data?.content || []);
      setRestaurants(rRes.data.data?.content || []);
      setCategories(cRes.data.data || []);
    } catch {
      toast.error('Failed to load menu items data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setForm({
      name: '',
      description: '',
      price: 99,
      isVeg: true,
      restaurantId: restaurants[0]?.id || '',
      categoryId: categories[0]?.id || ''
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (f) => {
    setForm({
      name: f.name || '',
      description: f.description || '',
      price: f.price || 99,
      isVeg: f.isVeg !== undefined ? f.isVeg : true,
      restaurantId: f.restaurant?.id || '',
      categoryId: f.category?.id || ''
    });
    setEditingId(f.id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.restaurantId || !form.categoryId) {
      toast.error('Please fill required fields');
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateFood(editingId, form);
        toast.success('Menu item updated successfully');
      } else {
        await createFood(form);
        toast.success('Menu item created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await deleteFood(id);
      toast.success('Menu item deleted successfully');
      fetchData();
    } catch {
      toast.error('Failed to delete menu item');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="foods" />
      <div className="admin-content">
        <header className="admin-header">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Manage Menu Items</h1>
          <button className="btn btn-primary" onClick={openCreateModal} id="add-food-btn">
            <FiPlus /> Add Menu Item
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
                    <th>Name</th>
                    <th>Restaurant</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map(f => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 600 }}>{f.name}</td>
                      <td>{f.restaurant?.name || <span style={{ color: 'var(--color-text-muted)' }}>None</span>}</td>
                      <td>{f.category?.name || <span style={{ color: 'var(--color-text-muted)' }}>None</span>}</td>
                      <td>₹{f.price}</td>
                      <td>
                        <span className={`badge ${f.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                          {f.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditModal(f)} aria-label="Edit food item">
                            <FiEdit />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(f.id)} aria-label="Delete food item">
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

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Menu Item' : 'Add Menu Item'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-label="Menu item management form">
            <div className="form-group">
              <label className="form-label" htmlFor="food-name">Item Name *</label>
              <input id="food-name" className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="food-desc">Description</label>
              <textarea id="food-desc" className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="food-price">Price (₹) *</label>
                <input id="food-price" className="form-input" type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: parseInt(e.target.value) || 0 }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="food-veg">Veg/Non-Veg</label>
                <select id="food-veg" className="form-input" value={form.isVeg ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, isVeg: e.target.value === 'true' }))}>
                  <option value="true">Vegetarian 🥦</option>
                  <option value="false">Non-Vegetarian 🍖</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="food-res">Restaurant *</label>
                <select id="food-res" className="form-input" value={form.restaurantId} onChange={e => setForm(p => ({ ...p, restaurantId: e.target.value }))} required>
                  <option value="">Select Restaurant</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="food-cat">Category *</label>
                <select id="food-cat" className="form-input" value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} required>
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? <span className="spinner spinner-sm" /> : 'Save Menu Item'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminFoods;
