import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash, FiX } from 'react-icons/fi';
import { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', cuisineType: '', description: '', address: '', deliveryTimeMins: 30, distanceKm: 2.5, minOrderAmount: 99, offerLabel: '', isVeg: false });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await getRestaurants({ size: 100 });
      setRestaurants(res.data.data?.content || []);
    } catch {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const openCreateModal = () => {
    setForm({ name: '', cuisineType: '', description: '', address: '', deliveryTimeMins: 30, distanceKm: 2.5, minOrderAmount: 99, offerLabel: '', isVeg: false });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (r) => {
    setForm({
      name: r.name || '',
      cuisineType: r.cuisineType || '',
      description: r.description || '',
      address: r.address || '',
      deliveryTimeMins: r.deliveryTimeMins || 30,
      distanceKm: r.distanceKm || 2.5,
      minOrderAmount: r.minOrderAmount || 99,
      offerLabel: r.offerLabel || '',
      isVeg: r.isVeg || false
    });
    setEditingId(r.id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.cuisineType.trim() || !form.address.trim()) {
      toast.error('Please fill required fields');
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateRestaurant(editingId, form);
        toast.success('Restaurant updated successfully');
      } else {
        await createRestaurant(form);
        toast.success('Restaurant created successfully');
      }
      setModalOpen(false);
      fetchRestaurants();
    } catch {
      toast.error('Failed to save restaurant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      await deleteRestaurant(id);
      toast.success('Restaurant deleted successfully');
      fetchRestaurants();
    } catch {
      toast.error('Failed to delete restaurant');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="restaurants" />
      <div className="admin-content">
        <header className="admin-header">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Manage Restaurants</h1>
          <button className="btn btn-primary" onClick={openCreateModal} id="add-restaurant-btn">
            <FiPlus /> Add Restaurant
          </button>
        </header>

        <main className="admin-page">
          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : (
            <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Cuisine</th>
                      <th>Delivery Time</th>
                      <th>Min Order</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{r.name}</td>
                        <td>{r.cuisineType}</td>
                        <td>{r.deliveryTimeMins} mins</td>
                        <td>₹{r.minOrderAmount}</td>
                        <td>
                          <span className={`badge ${r.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                            {r.isVeg ? 'VEG' : 'NON-VEG'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditModal(r)} aria-label="Edit restaurant">
                              <FiEdit />
                            </button>
                            <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(r.id)} aria-label="Delete restaurant">
                              <FiTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Restaurant' : 'Add Restaurant'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-label="Restaurant management form">
            <div className="form-group">
              <label className="form-label" htmlFor="res-name">Restaurant Name *</label>
              <input id="res-name" className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="res-cuisine">Cuisine Type *</label>
              <input id="res-cuisine" className="form-input" value={form.cuisineType} onChange={e => setForm(p => ({ ...p, cuisineType: e.target.value }))} placeholder="North Indian, Chinese" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="res-desc">Description</label>
              <textarea id="res-desc" className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="res-address">Address *</label>
              <input id="res-address" className="form-input" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="res-time">Delivery (mins)</label>
                <input id="res-time" className="form-input" type="number" value={form.deliveryTimeMins} onChange={e => setForm(p => ({ ...p, deliveryTimeMins: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="res-dist">Distance (km)</label>
                <input id="res-dist" className="form-input" type="number" step="0.1" value={form.distanceKm} onChange={e => setForm(p => ({ ...p, distanceKm: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="res-min">Min Order (₹)</label>
                <input id="res-min" className="form-input" type="number" value={form.minOrderAmount} onChange={e => setForm(p => ({ ...p, minOrderAmount: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
              <input id="res-veg" type="checkbox" checked={form.isVeg} onChange={e => setForm(p => ({ ...p, isVeg: e.target.checked }))} />
              <label htmlFor="res-veg" className="form-label" style={{ marginBottom: 0 }}>Pure Veg Restaurant</label>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? <span className="spinner spinner-sm" /> : 'Save Restaurant'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminRestaurants;
