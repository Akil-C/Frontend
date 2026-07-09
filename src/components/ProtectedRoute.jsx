import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" aria-label="Loading" />
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !user.roles?.includes('ROLE_ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
