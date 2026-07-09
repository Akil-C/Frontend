const SkeletonLoader = ({ type = 'card', count = 4 }) => {
  const renderCard = (i) => (
    <div key={i} className="card" style={{ padding: 0 }}>
      <div className="skeleton skeleton-img" />
      <div style={{ padding: '1rem' }}>
        <div className="skeleton skeleton-title" style={{ marginBottom: '0.5rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: '0.5rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '50%' }} />
      </div>
    </div>
  );

  const renderFood = (i) => (
    <div key={i} className="food-card">
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: '16px', height: '16px', borderRadius: '3px', marginBottom: '8px' }} />
        <div className="skeleton skeleton-title" style={{ marginBottom: '0.5rem' }} />
        <div className="skeleton skeleton-text" style={{ marginBottom: '0.25rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: '0.75rem' }} />
        <div className="skeleton" style={{ width: '60px', height: '1.25rem' }} />
      </div>
      <div className="skeleton" style={{ width: '120px', height: '110px', borderRadius: '0.625rem', flexShrink: 0 }} />
    </div>
  );

  const renderText = (i) => (
    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" style={{ width: '80%' }} />
    </div>
  );

  const map = { card: renderCard, food: renderFood, text: renderText };
  const renderer = map[type] || renderCard;

  return (
    <div className={type === 'card' ? 'restaurants-grid' : ''} style={type !== 'card' ? { display: 'flex', flexDirection: 'column', gap: '1rem' } : {}}>
      {Array.from({ length: count }, (_, i) => renderer(i))}
    </div>
  );
};

export default SkeletonLoader;
