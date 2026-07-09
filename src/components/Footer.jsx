import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-name">🍕 PrimeBites</div>
            <p className="footer-brand-desc">
              Your favourite restaurants delivered to your doorstep in minutes. Fast, fresh and delicious every time.
            </p>
            <div className="footer-social">
              {[
                { icon: <FiFacebook />, label: 'Facebook', href: '#' },
                { icon: <FiTwitter />, label: 'Twitter', href: '#' },
                { icon: <FiInstagram />, label: 'Instagram', href: '#' },
                { icon: <FiYoutube />, label: 'YouTube', href: '#' },
              ].map(s => (
                <a key={s.label} href={s.href} aria-label={s.label} rel="noopener noreferrer">{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="footer-col-title">Company</h3>
            <ul className="footer-links">
              {[['About Us', '/about'], ['Careers', '#'], ['Blog', '#'], ['Press', '#'], ['Investor Relations', '#']].map(([label, path]) => (
                <li key={label}><Link to={path} className="footer-link">→ {label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="footer-col-title">Support</h3>
            <ul className="footer-links">
              {[['Help Center', '/help'], ['Contact Us', '/help'], ['Partner With Us', '#'], ['Ride With Us', '#']].map(([label, path]) => (
                <li key={label}><Link to={path} className="footer-link">→ {label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="footer-col-title">Legal</h3>
            <ul className="footer-links">
              {[['Terms of Service', '#'], ['Privacy Policy', '#'], ['Cookie Policy', '#'], ['Refund Policy', '#']].map(([label, path]) => (
                <li key={label}><Link to={path} className="footer-link">→ {label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} PrimeBites. All rights reserved. Made with ❤️ for food lovers.</p>
          <p>🍕 Fast Delivery · 🌟 Top Restaurants · 💳 Secure Payments</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
