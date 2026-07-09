import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiClock, FiMapPin } from 'react-icons/fi';
import { getFavorites, removeRestaurantFavorite } from '../services/apiService';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await getFavorites();
      setFavorites(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (e, restaurantId) => {
    e.stopPropagation();
    try {
      await removeRestaurantFavorite(restaurantId);
      setFavorites(prev => prev.filter(f => f.restaurant?.id !== restaurantId));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove favorite');
    }
  };

  return (
    <div className="page-enter">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.75rem' }}>
          My Favorites ❤️
        </h1>

        {loading ? (
          <SkeletonLoader type="card" count={4} />
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">❤️</div>
            <h2 className="empty-state-title">No favorites yet</h2>
            <p className="empty-state-desc">Save your favourite restaurants to order again quickly.</p>
            <button className="btn btn-primary" onClick={() => navigate('/home')}>Explore Restaurants</button>
          </div>
        ) : (
          <div className="restaurants-grid">
            {favorites.map(fav => {
              const r = fav.restaurant;
              if (!r) return null;
              return (
                <article
                  key={fav.id}
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
                    <button
                      className="restaurant-card-fav active"
                      onClick={(e) => handleRemove(e, r.id)}
                      aria-label="Remove from favorites"
                    >
                      <FiHeart size={16} fill="var(--color-primary)" />
                    </button>
                  </div>
                  <div className="restaurant-card-body">
                    <h2 className="restaurant-card-name">{r.name}</h2>
                    <p className="restaurant-card-cuisine">{r.cuisineType}</p>
                    <div className="restaurant-card-meta">
                      <span><span className="rating">{r.rating ?? '4.0'} ★</span></span>
                      <span><FiClock size={12} /> {r.deliveryTimeMins ?? 30} min</span>
                      <span><FiMapPin size={12} /> {r.distanceKm ? `${r.distanceKm} km` : 'Nearby'}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
