import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiSearch } from 'react-icons/fi';
import { getRestaurants, getFoods } from '../services/apiService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

// High-resolution appetizing food imagery
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
];

const POPULAR_DISHES = [
  {
    id: 1,
    name: 'WILD MUSHROOM PIZZA',
    category: 'PIZZA',
    origin: 'STONE OVEN BAKED',
    price: '$18',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'SMOKED GRILLED SALMON',
    category: 'SEAFOOD',
    origin: 'CHEF SPECIAL',
    price: '$24',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'HEALTHY HARVEST BOWL',
    category: 'SALAD',
    origin: 'FARM FRESH GREENS',
    price: '$14',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'SMOKED CHEESE BURGER',
    category: 'BURGER',
    origin: 'FLAME GRILLED',
    price: '$16',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'SLOW ROASTED PRIME STEAK',
    category: 'GRILL',
    origin: 'SIGNATURE CUT',
    price: '$28',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'WARM ARTISAN SOURDOUGH',
    category: 'BAKERY',
    origin: 'FRESHLY BAKED',
    price: '$10',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
  },
];

const HEADLINE_WORD = 'PRIME BITES';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [dishes, setDishes] = useState(POPULAR_DISHES);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getFoods({ size: 6 })
      .then(res => {
        const items = res.data?.data?.content;
        if (items && items.length > 0) {
          const mapped = items.map((food, idx) => ({
            id: food.id,
            name: (food.name || 'SIGNATURE DISH').toUpperCase(),
            category: (food.category?.name || 'POPULAR').toUpperCase(),
            origin: food.restaurant?.name ? food.restaurant.name.toUpperCase() : 'FRESHLY PREPARED',
            price: `$${food.price || 15}`,
            image: food.imageUrl || POPULAR_DISHES[idx % POPULAR_DISHES.length].image,
            rawFood: food,
          }));
          setDishes(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickAdd = (dish, e) => {
    e.stopPropagation();
    if (dish.rawFood) {
      addToCart(dish.rawFood);
    } else {
      addToCart({
        id: dish.id,
        name: dish.name,
        price: parseFloat(dish.price.replace('$', '')) || 16,
        imageUrl: dish.image,
      });
    }
    toast.success(`ADDED ${dish.name} TO CART`);
  };

  return (
    <div className="editorial-landing-root">
      {/* ─── Hero Section: Full Viewport, Background: #ccd5ae (Sage) ─── */}
      <section className="editorial-hero" aria-label="Prime Bites Delicious Food Hero">
        <div className="editorial-hero-top-spacer" />

        {/* Centerpiece: Massive 'Anton' text (23vw) with staggered letter animation */}
        <div className="editorial-hero-center">
          <h1 className="editorial-headline-massive" aria-label={HEADLINE_WORD}>
            {HEADLINE_WORD.split('').map((char, index) => (
              <span
                key={index}
                className="editorial-char"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  marginRight: char === ' ' ? '3vw' : '0',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          {/* Floating Organic Cards with 3rem rounded corners & float animation */}
          <div
            className="floating-organic-card floating-card-1"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            <img src={HERO_IMAGES[0]} alt="Fresh healthy greens" />
          </div>

          <div
            className="floating-organic-card floating-card-2"
            style={{ transform: `translateY(-${scrollY * 0.05}px)` }}
          >
            <img src={HERO_IMAGES[1]} alt="Delicious meal bowl" />
          </div>

          <div
            className="floating-organic-card floating-card-3"
            style={{ transform: `translateY(${scrollY * 0.03}px)` }}
          >
            <img src={HERO_IMAGES[2]} alt="Chef freshly prepared dish" />
          </div>
        </div>

        {/* Bottom: Clear, simple, and friendly English description & search */}
        <div className="editorial-hero-bottom">
          <div className="editorial-hero-col-left">
            <p className="editorial-hero-desc">
              Fresh, delicious meals delivered fast to your doorstep. We partner with the best local
              restaurants and kitchens to bring hot, quality food right to you.
            </p>
            <form className="editorial-hero-search" onSubmit={handleSearchSubmit}>
              <FiSearch size={16} color="#01472e" style={{ marginRight: '0.5rem', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search food, restaurants, dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">SEARCH</button>
            </form>
          </div>

          <div className="editorial-hero-col-right">
            <div className="editorial-meta-block">
              <span className="editorial-meta-label">FOOD QUALITY</span>
              <span className="editorial-meta-value">100% FRESH INGREDIENTS</span>
            </div>
            <div className="editorial-meta-block">
              <span className="editorial-meta-label">DELIVERY TIME</span>
              <span className="editorial-meta-value">25 - 35 MINS AVERAGE</span>
            </div>
            <div className="editorial-meta-block">
              <span className="editorial-meta-label">SERVICE AREA</span>
              <span className="editorial-meta-value">ACROSS YOUR CITY</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Product/Feature Grid: Background: #e9edc9 (Olive), 5rem Top Corner ─── */}
      <section className="editorial-feature-section" aria-label="Popular Dishes Collection">
        <div className="editorial-section-header">
          <h2 className="editorial-section-title">
            FEATURED<br />DISHES
          </h2>

          {/* Large circular CTA button */}
          <Link to="/home" className="editorial-circular-cta">
            <span>VIEW</span>
            <span>ALL MENU</span>
            <FiArrowUpRight size={22} style={{ marginTop: '0.4rem' }} />
          </Link>
        </div>

        {/* 3-Column Layout with 4/5 Aspect Ratio Cards and Blur-Reveal Quick Add */}
        <div className="editorial-3col-grid">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="editorial-product-card"
              onClick={() => navigate('/home')}
            >
              <div className="editorial-card-tag">{dish.category}</div>

              <div className="editorial-card-media">
                <img src={dish.image} alt={dish.name} loading="lazy" />
              </div>

              {/* Bottom Card Information */}
              <div className="editorial-card-info-bottom">
                <h3 className="editorial-card-title">{dish.name}</h3>
                <div className="editorial-card-meta">
                  <span>{dish.origin}</span>
                  <span style={{ fontSize: '15px', fontWeight: 700 }}>{dish.price}</span>
                </div>
              </div>

              {/* Blur-Reveal Hover Overlay & Quick Add Button */}
              <div className="editorial-blur-overlay">
                <button
                  type="button"
                  className="editorial-quick-add-btn"
                  onClick={(e) => handleQuickAdd(dish, e)}
                >
                  ADD TO CART +
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
