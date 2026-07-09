import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiClock, FiStar, FiShield, FiZap, FiSmartphone } from 'react-icons/fi';
import { getRestaurants, getCategories } from '../services/apiService';

const HERO_DISHES = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
];

const TESTIMONIALS = [
  { name: 'Priya S.', city: 'Bangalore', review: 'Fastest delivery I have ever experienced! Food was still piping hot when it arrived.', rating: 5 },
  { name: 'Rahul M.', city: 'Mumbai', review: 'Amazing variety of restaurants. The biryani from Biryani House was absolutely divine!', rating: 5 },
  { name: 'Ananya K.', city: 'Delhi', review: 'The app is super smooth and the tracking feature is really satisfying to watch!', rating: 4 },
];

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  const [heroImg, setHeroImg] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.data || [])).catch(() => {});
    getRestaurants({ size: 6 }).then(r => setPopularRestaurants(r.data.data?.content || [])).catch(() => {});
    const interval = setInterval(() => setHeroImg(p => (p + 1) % HERO_DISHES.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="page-enter">
      {/* ─── Hero ─── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div className="hero-content">
            <div className="hero-tag">
              <FiZap size={14} /> ⚡ Lightning Fast Delivery
            </div>
            <h1 className="hero-title" id="hero-title">
              Delicious Food,<br /><span>Delivered Fast</span>
            </h1>
            <p className="hero-subtitle">
              Order from your favourite restaurants and get it delivered to your doorstep in minutes.
            </p>

            {/* Search */}
            <form className="hero-search-box" onSubmit={handleSearch} role="search">
              <FiSearch size={20} color="var(--color-text-muted)" style={{ marginLeft: '0.5rem', flexShrink: 0 }} aria-hidden="true" />
              <input
                id="hero-search"
                type="search"
                placeholder="Search for restaurant, cuisine or a dish..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search for food or restaurants"
                autoComplete="off"
              />
              <button className="btn btn-primary" type="submit" style={{ borderRadius: '1.25rem', flexShrink: 0 }}>
                Search
              </button>
            </form>

            {/* Stats */}
            <div className="hero-stats" aria-label="Platform statistics">
              {[
                { value: '500+', label: 'Restaurants' },
                { value: '30 min', label: 'Avg. Delivery' },
                { value: '1M+', label: 'Happy Customers' },
              ].map(s => (
                <div className="hero-stat" key={s.label}>
                  <div className="hero-stat-number">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <div style={{
              width: '440px', height: '440px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(252,128,25,0.25) 0%, rgba(226,55,68,0.12) 50%, transparent 75%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              filter: 'drop-shadow(0 0 60px rgba(252,128,25,0.15))'
            }}>
              <img
                src={HERO_DISHES[heroImg]}
                alt="Delicious food"
                style={{
                  width: '380px', height: '380px', borderRadius: '50%', objectFit: 'cover',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.35), 0 0 40px rgba(252,128,25,0.15)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  border: '4px solid rgba(255,255,255,0.12)'
                }}
                loading="eager"
              />
              {/* Glassmorphic Floating Badges */}
              {[
                { icon: '⭐', text: '4.8 Rating', top: '8%', left: '-8%', gradient: 'linear-gradient(135deg, rgba(255,184,0,0.9), rgba(255,152,0,0.85))' },
                { icon: '🛵', text: '30 min', bottom: '12%', right: '-12%', gradient: 'linear-gradient(135deg, rgba(46,196,182,0.9), rgba(0,150,136,0.85))' },
                { icon: '🎉', text: '50% OFF', top: '58%', left: '-16%', gradient: 'linear-gradient(135deg, rgba(226,55,68,0.95), rgba(233,30,99,0.9))' },
              ].map((b, i) => (
                <div key={i} style={{
                  position: 'absolute', top: b.top, left: b.left, right: b.right, bottom: b.bottom,
                  background: b.gradient,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: '#fff',
                  borderRadius: '1rem', padding: '0.625rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontWeight: 700, fontSize: '0.875rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: `${i * 0.6}s`,
                  zIndex: 2
                }}>
                  {b.icon} {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      {categories.length > 0 && (
        <section className="categories-section" aria-labelledby="categories-title">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" id="categories-title">Popular Cuisines</h2>
              <Link to="/search" className="section-link">See all →</Link>
            </div>
            <div className="categories-grid">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className="category-chip"
                  onClick={() => navigate(`/search?cuisine=${encodeURIComponent(cat.name)}`)}
                  aria-label={`Browse ${cat.name} cuisine`}
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="category-chip-img"
                    loading="lazy"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&auto=format&fit=crop'; }}
                  />
                  <span className="category-chip-label">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Popular Restaurants ─── */}
      {popularRestaurants.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="popular-restaurants-title">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" id="popular-restaurants-title">Popular Near You</h2>
              <Link to="/home" className="section-link">See all →</Link>
            </div>
            <div className="restaurants-grid">
              {popularRestaurants.map(r => (
                <article
                  key={r.id}
                  className="restaurant-card"
                  onClick={() => navigate(`/restaurants/${r.id}`)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${r.name} restaurant`}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/restaurants/${r.id}`)}
                >
                  <div className="restaurant-card-img-wrap">
                    <img
                      src={r.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop'}
                      alt={r.name}
                      className="restaurant-card-img"
                      loading="lazy"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop'; }}
                    />
                    {r.rating >= 4.5 && (
                      <div className="restaurant-card-badge">⚡ Lightning Fast</div>
                    )}
                  </div>
                  <div className="restaurant-card-body">
                    <h3 className="restaurant-card-name">{r.name}</h3>
                    <p className="restaurant-card-cuisine">{r.cuisineType} · {r.description?.substring(0, 40)}...</p>
                    <div className="restaurant-card-meta">
                      <span><span className="rating">{r.rating} ★</span></span>
                      <span><FiClock size={12} aria-hidden="true" /> {r.deliveryTimeMins} mins</span>
                      <span><FiMapPin size={12} aria-hidden="true" /> {r.distanceKm} km</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Why Choose Us ─── */}
      <section className="section" style={{ background: 'var(--color-bg-alt)' }} aria-labelledby="why-title">
        <div className="container">
          <h2 className="section-title text-center mb-6" id="why-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            Why Choose <span style={{ color: 'var(--color-primary)' }}>PrimeBites</span>?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <FiZap size={28} />, title: 'Lightning Fast', desc: 'Average delivery time under 30 minutes. We value your time!', color: 'var(--color-secondary)' },
              { icon: <FiStar size={28} />, title: 'Top Restaurants', desc: 'Curated selection of top-rated restaurants in your city.', color: 'var(--color-primary)' },
              { icon: <FiShield size={28} />, title: 'Safe & Reliable', desc: 'Contactless delivery, hygienically packed meals every time.', color: 'var(--color-accent)' },
              { icon: <FiSmartphone size={28} />, title: 'Live Tracking', desc: 'Track your order in real-time from prep to your doorstep.', color: '#9c27b0' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: '2rem', textAlign: 'center', border: 'none' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: `${f.color}18`, color: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem', fontSize: '1.75rem'
                }} aria-hidden="true">
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="section" aria-labelledby="reviews-title">
        <div className="container">
          <h2 className="section-title" id="reviews-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            What Our Customers Say
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }} aria-label={`${t.rating} stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} style={{ color: '#FFB800', fontSize: '1.1rem' }}>★</span>
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  "{t.review}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700
                  }} aria-hidden="true">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        padding: '5rem 0', textAlign: 'center'
      }} aria-labelledby="cta-title">
        <div className="container">
          <h2 id="cta-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Hungry? Order Now!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', marginBottom: '2rem' }}>
            Join over 1 million food lovers and get your first order delivered free.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--color-primary)', fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Get Started — It's Free
            </Link>
            <Link to="/home" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff', fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Browse Restaurants
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
