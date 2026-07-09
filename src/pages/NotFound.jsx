import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page-enter" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <span style={{ fontSize: '6rem', display: 'block', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }} aria-hidden="true">🍕</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>
          404
        </h1>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, margin: '1rem 0' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: 360, margin: '0 auto 2rem' }}>
          Sorry, the page you are looking for doesn't exist or has been moved to another location.
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: '0.875rem 2.5rem' }}>
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
