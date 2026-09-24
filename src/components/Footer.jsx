import { Link } from 'react-router-dom';
import { storeConfig } from '../config/store.config';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div className="grid grid-cols-4 gap-lg mb-xl">
          
          {/* Brand Info */}
          <div className="flex-col">
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <img src="/iee-logo-transparent.png" alt="IEE Logo" style={{ height: '70px' }} />
            </Link>
            <p className="text-muted text-sm mb-md" style={{ lineHeight: 1.6 }}>
              Premium quality products for babies, stunning Christmas decorations, and the latest trending seasonal items. Curated for the modern US family.
            </p>
            <p className="text-sm font-medium">Email: {storeConfig.contact.email}</p>
            <p className="text-sm font-medium">Phone: {storeConfig.contact.phone}</p>
          </div>

          {/* Shop */}
          <div className="flex-col">
            <h4 className="font-semibold mb-md">Shop</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/shop" className="text-sm text-muted hover-text">All Products</Link></li>
              <li><Link to="/shop/Baby" className="text-sm text-muted hover-text">Baby Collection</Link></li>
              <li><Link to="/shop/Christmas" className="text-sm text-muted hover-text">Christmas Shop</Link></li>
              <li><Link to="/shop/Home Product" className="text-sm text-muted hover-text">Home Product</Link></li>
              <li><Link to="/shop/Fashion" className="text-sm text-muted hover-text">Fashion</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex-col">
            <h4 className="font-semibold mb-md">Support</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/faq" className="text-sm text-muted hover-text">FAQ</Link></li>
              <li><Link to="/shipping" className="text-sm text-muted hover-text">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-sm text-muted hover-text">Return & Refund</Link></li>
              <li><Link to="/contact" className="text-sm text-muted hover-text">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex-col">
            <h4 className="font-semibold mb-md">Stay Updated</h4>
            <p className="text-sm text-muted mb-md">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form style={{ display: 'flex', gap: '0.5rem' }} onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input" 
                style={{ flex: 1, padding: '0.5rem' }}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {storeConfig.storeName}. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/privacy" className="text-sm text-muted hover-text">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted hover-text">Terms & Conditions</Link>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-text:hover { color: var(--accent-color); }
      `}} />
    </footer>
  );
};

export default Footer;
