import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiMapPin, FiStar, FiSliders, FiHeart } from 'react-icons/fi';
import { getRestaurants, getCategories, addRestaurantFavorite, removeRestaurantFavorite } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';
import useDebounce from '../hooks/useDebounce';

const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'rating', label: 'Rating' },
  { value: 'deliveryTime', label: 'Delivery Time' },
  { value: 'costLowToHigh', label: 'Cost: Low to High' },
  { value: 'costHighToLow', label: 'Cost: High to Low' },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const inputRef = useRef(null);

  const fetchRestaurants = useCallback(async (q = '', cat = '', sort = '', veg = false, pg = 0) => {
    setLoading(true);
    try {
      const params = { size: 12, page: pg };
      if (q) params.search = q;
      if (cat) params.categoryId = cat;
      if (sort) params.sort = sort;
      if (veg) params.vegOnly = true;
      const res = await getRestaurants(params);
      const data = res.data.data;
      setRestaurants(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useDebounce((q) => {
    setPage(0);
    fetchRestaurants(q, selectedCategory, sortBy, vegOnly, 0);
  }, 400);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.data || [])).catch(() => {});
    fetchRestaurants();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategoryClick = (catId) => {
    const newCat = catId === selectedCategory ? '' : catId;
    setSelectedCategory(newCat);
    setPage(0);
    fetchRestaurants(search, newCat, sortBy, vegOnly, 0);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setPage(0);
    fetchRestaurants(search, selectedCategory, sort, vegOnly, 0);
  };

  const handleVegToggle = () => {
    const newVeg = !vegOnly;
    setVegOnly(newVeg);
    setPage(0);
    fetchRestaurants(search, selectedCategory, sortBy, newVeg, 0);
  };

  const handlePageChange = (pg) => {
    setPage(pg);
    fetchRestaurants(search, selectedCategory, sortBy, vegOnly, pg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = async (e, restaurantId) => {
    e.stopPropagation();
    if (!isAuthenticated()) { toast.warning('Please login to add favorites'); navigate('/login'); return; }
    try {
      if (favorites.has(restaurantId)) {
        await removeRestaurantFavorite(restaurantId);
        setFavorites(prev => { const s = new Set(prev); s.delete(restaurantId); return s; });
        toast.success('Removed from favorites');
      } else {
        await addRestaurantFavorite(restaurantId);
        setFavorites(prev => new Set(prev).add(restaurantId));
        toast.success('Added to favorites ❤️');
      }
    } catch { toast.error('Could not update favorites'); }
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg, #fef2f2 0%, var(--color-bg) 100%)', padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '1.5rem' }}>
            Restaurants near you 🍽️
          </h1>
          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: 520, marginBottom: '1.25rem' }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <input
              ref={inputRef}
              id="home-search"
              className="form-input"
              style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-full)' }}
              type="search"
              placeholder="Search restaurants, cuisine or dishes..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Search restaurants"
            />
          </div>

          {/* Filters */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${vegOnly ? 'active' : ''}`}
              onClick={handleVegToggle}
              aria-pressed={vegOnly}
              id="veg-filter"
            >
              🥦 Pure Veg
            </button>
            {SORT_OPTIONS.slice(1).map(opt => (
              <button
                key={opt.value}
                className={`filter-tab ${sortBy === opt.value ? 'active' : ''}`}
                onClick={() => handleSortChange(sortBy === opt.value ? '' : opt.value)}
                aria-pressed={sortBy === opt.value}
              >
                {opt.value === 'rating' ? '⭐' : opt.value === 'deliveryTime' ? '⚡' : '💰'} {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
        {/* Category Chips */}
        {categories.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div className="filter-tabs">
              <button
                className={`filter-tab ${!selectedCategory ? 'active' : ''}`}
                onClick={() => handleCategoryClick('')}
              >
                🍽️ All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-tab ${selectedCategory === String(cat.id) ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(String(cat.id))}
                  aria-pressed={selectedCategory === String(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {restaurants.length} restaurants found {search && `for "${search}"`}
          </p>
        )}

        {/* Restaurants Grid */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : restaurants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h2 className="empty-state-title">No restaurants found</h2>
            <p className="empty-state-desc">Try adjusting your filters or search query</p>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setSelectedCategory(''); setSortBy(''); setVegOnly(false); fetchRestaurants(); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="restaurants-grid">
              {restaurants.map(r => (
                <article
                  key={r.id}
                  className="restaurant-card"
                  onClick={() => navigate(`/restaurants/${r.id}`)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${r.name}, ${r.cuisineType}`}
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
                    {r.offers && <div className="restaurant-card-badge">{r.offers}</div>}
                    <button
                      className={`restaurant-card-fav ${favorites.has(r.id) ? 'active' : ''}`}
                      onClick={(e) => toggleFavorite(e, r.id)}
                      aria-label={favorites.has(r.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FiHeart size={16} fill={favorites.has(r.id) ? 'var(--color-primary)' : 'none'} />
                    </button>
                  </div>
                  <div className="restaurant-card-body">
                    <h2 className="restaurant-card-name">{r.name}</h2>
                    <p className="restaurant-card-cuisine">{r.cuisineType}{r.costForTwo ? ` · ₹${r.costForTwo} for two` : ''}</p>
                    <div className="restaurant-card-meta">
                      <span><span className="rating">{r.rating ?? '4.0'} ★</span></span>
                      <span><FiClock size={12} aria-hidden="true" /> {r.deliveryTimeMins ?? 30} min</span>
                      <span><FiMapPin size={12} aria-hidden="true" /> {r.distanceKm ? `${r.distanceKm} km` : 'Nearby'}</span>
                    </div>
                    {!r.isOpened && (
                      <div style={{ marginTop: '0.5rem', color: 'var(--color-error)', fontSize: '0.75rem', fontWeight: 700 }}>Currently Closed</div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="pagination" aria-label="Page navigation">
                <button className="page-btn" onClick={() => handlePageChange(page - 1)} disabled={page === 0} aria-label="Previous page">‹</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${page === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                    aria-label={`Page ${i + 1}`}
                    aria-current={page === i ? 'page' : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="page-btn" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} aria-label="Next page">›</button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
