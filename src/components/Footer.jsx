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
      toast.success('SUBSCRIBED TO THE EDITORIAL GAZETTE');
      setEmail('');
    }
  };

  return (
    <footer className="editorial-footer" role="contentinfo">
      <div className="editorial-footer-grid">
        {/* Left 6 cols: Large newsletter signup with uppercase underline-only input field */}
        <div className="editorial-footer-newsletter">
          <h2 className="editorial-footer-headline">
            THE GASTRONOMIC<br />DISPATCH
          </h2>
          <p className="editorial-newsletter-desc">
            Receive exclusive invitations to seasonal tastings, secret supper clubs, and curated menus
            crafted by our network of master artisans and foragers.
          </p>
          <form className="editorial-newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="editorial-newsletter-input"
              placeholder="ENTER YOUR EMAIL FOR CORRESPONDENCE"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="editorial-newsletter-submit">
              JOIN
            </button>
          </form>
        </div>

        {/* Right 6 cols: Two columns of links using bold, tracked-out 11px uppercase text */}
        <div className="editorial-footer-links-wrap">
          <div>
            <div className="editorial-footer-col-title">CURATION</div>
            <ul className="editorial-footer-link-list">
              <li><Link to="/home" className="editorial-footer-link">SIGNATURE MENUS</Link></li>
              <li><Link to="/about" className="editorial-footer-link">PROVENANCE & ORIGIN</Link></li>
              <li><Link to="/offers" className="editorial-footer-link">SEASONAL SPECIALS</Link></li>
              <li><Link to="/search" className="editorial-footer-link">ESTATE DIRECTORY</Link></li>
              <li><Link to="/help" className="editorial-footer-link">CONCIERGE DESK</Link></li>
            </ul>
          </div>

          <div>
            <div className="editorial-footer-col-title">INSTITUTION</div>
            <ul className="editorial-footer-link-list">
              <li><a href="#manifesto" className="editorial-footer-link">OUR MANIFESTO</a></li>
              <li><a href="#artisan" className="editorial-footer-link">BECOME AN ARTISAN</a></li>
              <li><a href="#press" className="editorial-footer-link">PRESS ARCHIVE</a></li>
              <li><a href="#sustainability" className="editorial-footer-link">REGENERATIVE PLEDGE</a></li>
              <li><a href="#careers" className="editorial-footer-link">CULINARY FELLOWSHIPS</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom: Copyright and legal links with 30% opacity */}
      <div className="editorial-footer-bottom">
        <div>
          © {currentYear} PRIME BITES EDITORIAL GASTRONOMY. ALL RIGHTS RESERVED.
        </div>
        <div className="editorial-footer-legal-links">
          <a href="#terms">TERMS OF SERVICE</a>
          <a href="#privacy">PRIVACY DIRECTIVE</a>
          <a href="#cookie">COOKIE PROTOCOL</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
