import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import { getActiveCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ code: '', discountPercentage: 10, discountAmount: 0, maxDiscountAmount: 100, minOrderValue: 200, expiryDate: '', isActive: true });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await getActiveCoupons();
      setCoupons(res.data.data || []);
    } catch {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setForm({
      code: '',
      discountPercentage: 10,
      discountAmount: 0,
      maxDiscountAmount: 100,
      minOrderValue: 200,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setForm({
      code: c.code || '',
      discountPercentage: c.discountPercentage || 0,
      discountAmount: c.discountAmount || 0,
      maxDiscountAmount: c.maxDiscountAmount || 0,
      minOrderValue: c.minOrderValue || 0,
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : '',
      isActive: c.isActive !== undefined ? c.isActive : true
    });
    setEditingId(c.id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) { toast.error('Coupon code is required'); return; }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCoupon(editingId, form);
        toast.success('Coupon updated successfully');
      } else {
        await createCoupon(form);
        toast.success('Coupon created successfully');
      }
      setModalOpen(false);
      fetchCoupons();
    } catch {
      toast.error('Failed to save coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="coupons" />
      <div className="admin-content">
        <header className="admin-header">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>Manage Coupons</h1>
          <button className="btn btn-primary" onClick={openCreateModal} id="add-coupon-btn">
            <FiPlus /> Add Coupon
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
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Min Order</th>
                    <th>Max Discount</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{c.code}</td>
                      <td>{c.discountPercentage ? `${c.discountPercentage}%` : `₹${c.discountAmount}`}</td>
                      <td>₹{c.minOrderValue}</td>
                      <td>₹{c.maxDiscountAmount || 'No Limit'}</td>
                      <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${c.isActive ? 'badge-success' : 'badge-nonveg'}`}>
                          {c.isActive ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditModal(c)} aria-label="Edit coupon">
                            <FiEdit />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(c.id)} aria-label="Delete coupon">
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

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Coupon' : 'Add Coupon'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-label="Coupon management form">
            <div className="form-group">
              <label className="form-label" htmlFor="coup-code">Coupon Code *</label>
              <input id="coup-code" className="form-input" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="SAVE50" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="coup-perc">Discount Percentage (%)</label>
                <input id="coup-perc" className="form-input" type="number" value={form.discountPercentage} onChange={e => setForm(p => ({ ...p, discountPercentage: parseInt(e.target.value) || 0, discountAmount: 0 }))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="coup-amt">Flat Discount Amount (₹)</label>
                <input id="coup-amt" className="form-input" type="number" value={form.discountAmount} onChange={e => setForm(p => ({ ...p, discountAmount: parseInt(e.target.value) || 0, discountPercentage: 0 }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="coup-max">Max Discount Amount (₹)</label>
                <input id="coup-max" className="form-input" type="number" value={form.maxDiscountAmount} onChange={e => setForm(p => ({ ...p, maxDiscountAmount: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="coup-min">Min Order Value (₹)</label>
                <input id="coup-min" className="form-input" type="number" value={form.minOrderValue} onChange={e => setForm(p => ({ ...p, minOrderValue: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="coup-expiry">Expiry Date *</label>
                <input id="coup-expiry" className="form-input" type="date" value={form.expiryDate} onChange={e => setForm(p => ({ ...p, expiryDate: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="coup-active">Status</label>
                <select id="coup-active" className="form-input" value={form.isActive ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, isActive: e.target.value === 'true' }))}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? <span className="spinner spinner-sm" /> : 'Save Coupon'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCoupons;
