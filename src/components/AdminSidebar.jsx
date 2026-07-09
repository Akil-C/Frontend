import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiShoppingBag, FiLayers, FiList, FiUsers, FiTag, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminSidebar = ({ active }) => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome />, path: '/admin' },
    { id: 'restaurants', label: 'Restaurants', icon: <FiTrendingUp />, path: '/admin/restaurants' },
    { id: 'categories', label: 'Categories', icon: <FiLayers />, path: '/admin/categories' },
    { id: 'foods', label: 'Menu Items', icon: <FiList />, path: '/admin/foods' },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders' },
    { id: 'users', label: 'Users', icon: <FiUsers />, path: '/admin/users' },
    { id: 'coupons', label: 'Coupons', icon: <FiTag />, path: '/admin/coupons' },
  ];

  return (
    <aside className="admin-sidebar" aria-label="Admin sidebar navigation">
      <div className="admin-sidebar-logo">
        ⚙️ DeliverY Admin
      </div>
      <nav className="admin-nav">
        {menuItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            className={`admin-nav-item ${active === item.id ? 'active' : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="admin-nav-item"
        style={{ marginTop: 'auto', background: 'transparent', border: 'none', width: '100%', textAlign: 'left', color: 'var(--color-error)' }}
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default AdminSidebar;
