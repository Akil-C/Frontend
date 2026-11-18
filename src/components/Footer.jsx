import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('THANK YOU FOR SUBSCRIBING TO OUR OFFERS!');
      setEmail('');
    }
  };

  return (
    <footer className="editorial-footer" role="contentinfo">
      <div className="editorial-footer-grid">
        {/* Left 6 cols: Newsletter signup */}
        <div className="editorial-footer-newsletter">
          <h2 className="editorial-footer-headline">
            SPECIAL OFFERS<br />& UPDATES
          </h2>
          <p className="editorial-newsletter-desc">
            Subscribe to our newsletter for weekly discount coupons, newly added restaurants,
            and exclusive food delivery deals.
          </p>
          <form className="editorial-newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="editorial-newsletter-input"
              placeholder="ENTER YOUR EMAIL FOR DEALS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="editorial-newsletter-submit">
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* Right 6 cols: Two columns of helpful links */}
        <div className="editorial-footer-links-wrap">
          <div>
            <div className="editorial-footer-col-title">ORDER FOOD</div>
            <ul className="editorial-footer-link-list">
              <li><Link to="/home" className="editorial-footer-link">EXPLORE MENU</Link></li>
              <li><Link to="/offers" className="editorial-footer-link">SPECIAL OFFERS</Link></li>
              <li><Link to="/search" className="editorial-footer-link">SEARCH RESTAURANTS</Link></li>
              <li><Link to="/orders" className="editorial-footer-link">TRACK ORDERS</Link></li>
              <li><Link to="/help" className="editorial-footer-link">HELP & SUPPORT</Link></li>
            </ul>
          </div>

          <div>
            <div className="editorial-footer-col-title">ABOUT US</div>
            <ul className="editorial-footer-link-list">
              <li><Link to="/about" className="editorial-footer-link">OUR STORY</Link></li>
              <li><a href="#partner" className="editorial-footer-link">PARTNER WITH US</a></li>
              <li><a href="#rider" className="editorial-footer-link">BECOME A RIDER</a></li>
              <li><a href="#careers" className="editorial-footer-link">CAREERS</a></li>
              <li><Link to="/help" className="editorial-footer-link">CONTACT SUPPORT</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom: Copyright and legal links */}
      <div className="editorial-footer-bottom">
        <div>
          © {currentYear} PRIME BITES FOOD DELIVERY. ALL RIGHTS RESERVED.
        </div>
        <div className="editorial-footer-legal-links">
          <a href="#terms">TERMS OF SERVICE</a>
          <a href="#privacy">PRIVACY POLICY</a>
          <a href="#cookie">COOKIE SETTINGS</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
