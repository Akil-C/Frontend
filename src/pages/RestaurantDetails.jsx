import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiMapPin, FiStar, FiHeart, FiChevronDown, FiPlus, FiMinus } from 'react-icons/fi';
import { getRestaurantById, getRestaurantMenu } from '../services/apiService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, updateItem, removeItem, getItemQuantity, getCartItemId, cartCount } = useCart();
  const { toast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [vegFilter, setVegFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, mRes] = await Promise.all([
          getRestaurantById(id),
          getRestaurantMenu(id)
        ]);
        setRestaurant(rRes.data.data);
        const items = mRes.data.data || [];
        // Group by category
        const grouped = items.reduce((acc, food) => {
          const cat = food.category?.name || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(food);
          return acc;
        }, {});
        const groupedArr = Object.entries(grouped).map(([name, foods]) => ({ name, foods }));
        setMenuData(groupedArr);
        if (groupedArr.length) setActiveCategory(groupedArr[0].name);
      } catch {
        toast.error('Failed to load restaurant');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async (food) => {
    if (!isAuthenticated()) { toast.warning('Please login to add items'); navigate('/login'); return; }
    try {
      await addItem(food.id, 1);
      toast.success(`${food.name} added to cart 🛒`);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg?.includes('different restaurant')) {
        toast.error('Clear your cart first to order from a different restaurant');
      } else {
        toast.error('Could not add to cart');
      }
    }
  };

  const handleUpdateQty = async (food, delta) => {
    const qty = getItemQuantity(food.id);
    const cartItemId = getCartItemId(food.id);
    if (qty + delta <= 0 && cartItemId) {
      await removeItem(cartItemId);
    } else if (cartItemId) {
      await updateItem(cartItemId, qty + delta);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="skeleton" style={{ height: 320, borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }} />
        <SkeletonLoader type="food" count={4} />
      </div>
    );
  }

  if (!restaurant) return null;

  const filteredMenu = vegFilter
    ? menuData.map(g => ({ ...g, foods: g.foods.filter(f => f.isVeg) })).filter(g => g.foods.length)
    : menuData;

  return (
    <div className="page-enter">
      {/* Cover */}
      <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <img
          src={restaurant.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1280&auto=format&fit=crop'}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1280&auto=format&fit=crop'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))' }} aria-hidden="true" />
        {/* Restaurant Info Overlay */}
        <div className="container" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', paddingBottom: '1.5rem', color: '#fff' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
            {restaurant.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
            {restaurant.cuisineType} · {restaurant.description?.substring(0, 80)}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span className="rating rating-lg">{restaurant.rating ?? '4.0'} ★</span>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>({restaurant.totalRatings ?? 0} ratings)</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.9375rem' }}>
              <FiClock size={14} aria-hidden="true" /> {restaurant.deliveryTimeMins ?? 30} min delivery
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.9375rem' }}>
              <FiMapPin size={14} aria-hidden="true" /> {restaurant.address}
            </span>
            {restaurant.minOrderAmount && (
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
                Min. order ₹{restaurant.minOrderAmount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Left: Category Sidebar */}
          <aside style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)' }}>
            <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border-light)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                Menu Categories
              </div>
              {filteredMenu.map(group => (
                <button
                  key={group.name}
                  onClick={() => {
                    setActiveCategory(group.name);
                    document.getElementById(`cat-${group.name}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 500,
                    borderLeft: `3px solid ${activeCategory === group.name ? 'var(--color-primary)' : 'transparent'}`,
                    background: activeCategory === group.name ? 'var(--color-primary-bg)' : 'transparent',
                    color: activeCategory === group.name ? 'var(--color-primary)' : 'var(--color-text)',
                    transition: 'all 0.15s', cursor: 'pointer'
                  }}
                >
                  {group.name} <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>({group.foods.length})</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Right: Menu Items */}
          <main>
            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                className={`filter-tab ${vegFilter ? 'active' : ''}`}
                onClick={() => setVegFilter(p => !p)}
                aria-pressed={vegFilter}
                id="menu-veg-filter"
              >
                🥦 Veg Only
              </button>
              {cartCount > 0 && (
                <button className="btn btn-primary" onClick={() => navigate('/cart')} style={{ fontSize: '0.875rem' }}>
                  View Cart ({cartCount} items) →
                </button>
              )}
            </div>

            {filteredMenu.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🥗</div>
                <h2 className="empty-state-title">No veg items available</h2>
                <p className="empty-state-desc">This restaurant has no vegetarian options currently</p>
              </div>
            ) : (
              filteredMenu.map(group => (
                <section key={group.name} id={`cat-${group.name}`} style={{ marginBottom: '2.5rem', scrollMarginTop: 'calc(var(--navbar-height) + 1rem)' }} aria-labelledby={`cat-heading-${group.name}`}>
                  <h2 id={`cat-heading-${group.name}`} style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {group.name} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 400 }}>({group.foods.length})</span>
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {group.foods.map(food => {
                      const qty = getItemQuantity(food.id);
                      const cartItemId = getCartItemId(food.id);
                      return (
                        <article key={food.id} className="food-card" aria-label={`${food.name}, ₹${food.price}`}>
                          <div className="food-card-info">
                            <div className={`food-card-type ${food.isVeg ? 'veg' : 'nonveg'}`} aria-label={food.isVeg ? 'Vegetarian' : 'Non-vegetarian'} />
                            <h3 className="food-card-name">{food.name}</h3>
                            <p className="food-card-desc">{food.description}</p>
                            <p className="food-card-price">₹{food.price}</p>
                            {food.rating && (
                              <span className="rating" style={{ fontSize: '0.75rem', marginTop: '0.375rem', display: 'inline-flex' }}>
                                {food.rating} ★
                              </span>
                            )}
                          </div>
                          <div className="food-card-img-wrap">
                            <img
                              src={food.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop'}
                              alt={food.name}
                              className="food-card-img"
                              loading="lazy"
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop'; }}
                            />
                            {qty === 0 ? (
                              <button className="food-card-add" onClick={() => handleAddToCart(food)} aria-label={`Add ${food.name} to cart`}>
                                ADD
                              </button>
                            ) : (
                              <div className="food-card-counter" role="group" aria-label={`${food.name} quantity`}>
                                <button onClick={() => handleUpdateQty(food, -1)} aria-label="Decrease quantity"><FiMinus size={14} /></button>
                                <span aria-live="polite" aria-label={`${qty} in cart`}>{qty}</span>
                                <button onClick={() => handleUpdateQty(food, 1)} aria-label="Increase quantity"><FiPlus size={14} /></button>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
