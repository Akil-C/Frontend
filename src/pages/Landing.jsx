import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiSearch } from 'react-icons/fi';
import { getRestaurants, getFoods } from '../services/apiService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

// High-end culinary photography
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80', // Organic Greens
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80', // Fresh Bowl
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80', // Artisanal Plate
];

const CURATED_ITEMS = [
  {
    id: 1,
    name: 'TRUFFLE WILD MUSHROOM',
    category: 'BOTANICAL',
    origin: 'FOREST FORAGED',
    price: '$28',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'SMOKED ARTISAN SALMON',
    category: 'SEAFOOD',
    origin: 'NORDIC WATERS',
    price: '$34',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'ORGANIC HARVEST BOWL',
    category: 'SEASONAL',
    origin: 'VALLEY ORCHARDS',
    price: '$24',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'ROASTED HEIRLOOM PUMPKIN',
    category: 'BOTANICAL',
    origin: 'HIGHLAND FARMS',
    price: '$22',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'DRY-AGED PRIME CUT',
    category: 'HERITAGE',
    origin: 'PASTURE RAISED',
    price: '$46',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'SOURDOUGH & CULTURED BUTTER',
    category: 'BAKERY',
    origin: 'ANCIENT GRAINS',
    price: '$16',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
  },
];

const HEADLINE_WORD = 'GASTRONOMY';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [dishes, setDishes] = useState(CURATED_ITEMS);
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
    // Attempt to load dynamic dishes from backend if available
    getFoods({ size: 6 })
      .then(res => {
        const items = res.data?.data?.content;
        if (items && items.length > 0) {
          const mapped = items.map((food, idx) => ({
            id: food.id,
            name: (food.name || 'SIGNATURE DISH').toUpperCase(),
            category: (food.category?.name || 'CHEF SPECIAL').toUpperCase(),
            origin: food.restaurant?.name ? food.restaurant.name.toUpperCase() : 'ESTATE GROWN',
            price: `$${food.price || 25}`,
            image: food.imageUrl || CURATED_ITEMS[idx % CURATED_ITEMS.length].image,
            rawFood: food,
          }));
          setDishes(mapped);
        }
      })
      .catch(() => {
        // Fallback to curated high-fashion editorial dataset
      });
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
        price: parseFloat(dish.price.replace('$', '')) || 24,
        imageUrl: dish.image,
      });
    }
    toast.success(`ADDED ${dish.name} TO CART`);
  };

  return (
    <div className="editorial-landing-root">
      {/* ─── Hero Section: Full Viewport, Background: #ccd5ae (Sage) ─── */}
      <section className="editorial-hero" aria-label="Editorial Gastronomy Hero">
        <div className="editorial-hero-top-spacer" />

        {/* Centerpiece: Massive 'Anton' text (23vw) with letter-by-letter stagger reveal */}
        <div className="editorial-hero-center">
          <h1 className="editorial-headline-massive" aria-label={HEADLINE_WORD}>
            {HEADLINE_WORD.split('').map((char, index) => (
              <span
                key={index}
                className="editorial-char"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {char}
              </span>
            ))}
          </h1>

          {/* Floating Organic Cards with 3rem rounded corners, parallax scroll speed factor 0.05 */}
          <div
            className="floating-organic-card floating-card-1"
            style={{
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          >
            <img src={HERO_IMAGES[0]} alt="Botanical greens" />
          </div>

          <div
            className="floating-organic-card floating-card-2"
            style={{
              transform: `translateY(-${scrollY * 0.05}px)`,
            }}
          >
            <img src={HERO_IMAGES[1]} alt="Artisanal plate" />
          </div>

          <div
            className="floating-organic-card floating-card-3"
            style={{
              transform: `translateY(${scrollY * 0.03}px)`,
            }}
          >
            <img src={HERO_IMAGES[2]} alt="Organic harvest" />
          </div>
        </div>

        {/* Bottom: Dual-column descriptive text and location/origin labels */}
        <div className="editorial-hero-bottom">
          <div className="editorial-hero-col-left">
            <p className="editorial-hero-desc">
              Culinary curation driven by nature. We partner exclusively with sustainable estates,
              regenerative fisheries, and visionary chefs to deliver haute cuisine to your private residence.
            </p>
            <form className="editorial-hero-search" onSubmit={handleSearchSubmit}>
              <FiSearch size={16} color="#01472e" style={{ marginRight: '0.5rem' }} />
              <input
                type="text"
                placeholder="DISCOVER FLAVORS, CUISINES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">SEARCH</button>
            </form>
          </div>

          <div className="editorial-hero-col-right">
            <div className="editorial-meta-block">
              <span className="editorial-meta-label">ORIGIN PROVENANCE</span>
              <span className="editorial-meta-value">ORGANIC / REGENERATIVE</span>
            </div>
            <div className="editorial-meta-block">
              <span className="editorial-meta-label">SPEED SIGNATURE</span>
              <span className="editorial-meta-value">25 - 35 MIN DISPATCH</span>
            </div>
            <div className="editorial-meta-block">
              <span className="editorial-meta-label">TERROIR</span>
              <span className="editorial-meta-value">METROPOLITAN CLUSTER</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Product/Feature Grid: Background: #e9edc9 (Olive), 5rem Top Corner ─── */}
      <section className="editorial-feature-section" aria-label="Curated Feature Collection">
        <div className="editorial-section-header">
          <h2 className="editorial-section-title">
            SEASONAL<br />HARVEST
          </h2>

          {/* Large circular CTA button */}
          <Link to="/home" className="editorial-circular-cta">
            <span>EXPLORE</span>
            <span>ALL DISHES</span>
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

              {/* Default Bottom Information */}
              <div className="editorial-card-info-bottom">
                <h3 className="editorial-card-title">{dish.name}</h3>
                <div className="editorial-card-meta">
                  <span>{dish.origin}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{dish.price}</span>
                </div>
              </div>

              {/* Blur-Reveal Hover Overlay & Quick Add Button translating up 32px */}
              <div className="editorial-blur-overlay">
                <button
                  type="button"
                  className="editorial-quick-add-btn"
                  onClick={(e) => handleQuickAdd(dish, e)}
                >
                  QUICK ADD +
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
