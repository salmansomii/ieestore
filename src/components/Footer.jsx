import { Link } from 'react-router-dom';
import { storeConfig } from '../config/store.config';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '3.5rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
          
          {/* Brand Info */}
          <div className="flex-col">
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <img src="/taicon-logo.png" alt="Taicon Store" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p className="text-muted text-sm mb-md" style={{ lineHeight: 1.6 }}>
              Taicon Store is Pakistan's trusted distributor of high efficiency Tier-1 Solar Energy Systems and premium Home Appliances with Cash on Delivery nationwide.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <MapPin size={16} style={{ color: '#ea580c', flexShrink: 0 }} />
                <span>{storeConfig.contact.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <Phone size={16} style={{ color: '#ea580c', flexShrink: 0 }} />
                <span>{storeConfig.contact.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <Mail size={16} style={{ color: '#ea580c', flexShrink: 0 }} />
                <span>{storeConfig.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="flex-col">
            <h4 className="font-semibold mb-md" style={{ fontSize: '1.05rem', color: '#ea580c' }}>Shop by Category</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link to="/shop/Solar System" className="text-sm text-muted hover-text">Solar System</Link></li>
              <li><Link to="/shop/Home Product" className="text-sm text-muted hover-text">Home Products</Link></li>
              <li><Link to="/shop" className="text-sm text-muted hover-text">All Products</Link></li>
              <li><Link to="/cart" className="text-sm text-muted hover-text">View Cart</Link></li>
              <li><Link to="/checkout" className="text-sm text-muted hover-text">Cash on Delivery Checkout</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="flex-col">
            <h4 className="font-semibold mb-md" style={{ fontSize: '1.05rem', color: '#ea580c' }}>Customer Support</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link to="/shipping" className="text-sm text-muted hover-text">Delivery & COD Info</Link></li>
              <li><Link to="/returns" className="text-sm text-muted hover-text">Warranty & Return Policy</Link></li>
              <li><Link to="/faq" className="text-sm text-muted hover-text">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="text-sm text-muted hover-text">Contact Support</Link></li>
              <li><Link to="/about" className="text-sm text-muted hover-text">About Taicon</Link></li>
            </ul>
          </div>

          {/* Payment & Verification */}
          <div className="flex-col">
            <h4 className="font-semibold mb-md" style={{ fontSize: '1.05rem', color: '#ea580c' }}>Order with Confidence</h4>
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <p className="text-sm font-bold mb-xs" style={{ color: '#16a34a' }}>✓ 100% Cash on Delivery</p>
              <p className="text-xs text-muted mb-md">No upfront online card payments required. Inspect your package at delivery before paying.</p>
              <a 
                href={storeConfig.social.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary btn-full text-sm"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: 'white', textAlign: 'center', textDecoration: 'none', padding: '0.6rem 1rem' }}
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {storeConfig.storeName} ({storeConfig.domain}). All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/privacy" className="text-sm text-muted hover-text">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted hover-text">Terms & Conditions</Link>
            <Link to="/order" className="text-sm text-muted hover-text">Admin Orders</Link>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-text:hover { color: #ea580c; }
        @media (min-width: 768px) {
          .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
      `}} />
    </footer>
  );
};

export default Footer;
