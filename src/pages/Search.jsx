import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiMapPin } from 'react-icons/fi';
import { getRestaurants } from '../services/apiService';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';
import useDebounce from '../hooks/useDebounce';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async (q) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await getRestaurants({ search: q, size: 20 });
      setResults(res.data.data?.content || []);
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const debouncedSearch = useDebounce(doSearch, 400);

  useEffect(() => {
    if (query) doSearch(query);
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="page-enter">
      <div style={{ background: 'linear-gradient(180deg, #fef2f2 0%, var(--color-bg) 100%)', padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Search Restaurants 🔍
          </h1>
          <div style={{ position: 'relative', maxWidth: 540 }}>
            <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '1.125rem' }} aria-hidden="true" />
            <input
              id="search-input"
              className="form-input"
              style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-full)', fontSize: '1rem', height: '52px' }}
              type="search"
              placeholder="Search restaurants, cuisine or dish..."
              value={query}
              onChange={handleChange}
              autoFocus
              aria-label="Search"
              aria-controls="search-results"
            />
          </div>
        </div>
      </div>

      <div id="search-results" className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }} aria-live="polite" aria-label="Search results">
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : !searched ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }} aria-hidden="true">🔍</div>
            <p style={{ fontSize: '1.125rem' }}>Start typing to search for restaurants and dishes</p>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">😔</div>
            <h2 className="empty-state-title">No results found</h2>
            <p className="empty-state-desc">Try different keywords or browse all restaurants</p>
            <button className="btn btn-primary" onClick={() => navigate('/home')}>Browse All Restaurants</button>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <div className="restaurants-grid">
              {results.map(r => (
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
                    <img src={r.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop'} alt={r.name} className="restaurant-card-img" loading="lazy" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop'; }} />
                  </div>
                  <div className="restaurant-card-body">
                    <h2 className="restaurant-card-name">{r.name}</h2>
                    <p className="restaurant-card-cuisine">{r.cuisineType}</p>
                    <div className="restaurant-card-meta">
                      <span><span className="rating">{r.rating ?? '4.0'} ★</span></span>
                      <span><FiClock size={12} /> {r.deliveryTimeMins ?? 30} min</span>
                      <span><FiMapPin size={12} /> Nearby</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
