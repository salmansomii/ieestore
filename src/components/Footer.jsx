import { Link } from 'react-router-dom';
import { storeConfig } from '../config/store.config';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-lg">
          
          {/* Brand Info */}
          <div className="flex-col">
            <Link to="/" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
              <img src="/taicon-logo.png" alt="Taicon Store" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p className="text-muted text-xs mb-sm" style={{ lineHeight: 1.6 }}>
              Taicon Store is Pakistan's trusted distributor of high efficiency Tier-1 Solar Energy Systems and premium Home Appliances with Cash on Delivery nationwide.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                <MapPin size={15} style={{ color: '#ea580c', flexShrink: 0 }} />
                <span>{storeConfig.contact.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                <Phone size={15} style={{ color: '#ea580c', flexShrink: 0 }} />
                <span>{storeConfig.contact.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                <Mail size={15} style={{ color: '#ea580c', flexShrink: 0 }} />
                <span>{storeConfig.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="flex-col">
            <h4 className="font-semibold mb-sm" style={{ fontSize: '0.95rem', color: '#ea580c' }}>Shop by Category</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link to="/shop/Solar System" className="text-xs text-muted hover-text">Solar Systems</Link></li>
              <li><Link to="/shop/Home Product" className="text-xs text-muted hover-text">Home Appliances</Link></li>
              <li><Link to="/shop" className="text-xs text-muted hover-text">All Products</Link></li>
              <li><Link to="/cart" className="text-xs text-muted hover-text">View Cart</Link></li>
              <li><Link to="/checkout" className="text-xs text-muted hover-text">Cash on Delivery Checkout</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="flex-col">
            <h4 className="font-semibold mb-sm" style={{ fontSize: '0.95rem', color: '#ea580c' }}>Customer Support</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link to="/shipping" className="text-xs text-muted hover-text">Delivery & COD Info</Link></li>
              <li><Link to="/returns" className="text-xs text-muted hover-text">Warranty & Return Policy</Link></li>
              <li><Link to="/faq" className="text-xs text-muted hover-text">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="text-xs text-muted hover-text">Contact Support</Link></li>
              <li><Link to="/about" className="text-xs text-muted hover-text">About Taicon</Link></li>
            </ul>
          </div>

          {/* Payment & Verification */}
          <div className="flex-col">
            <h4 className="font-semibold mb-sm" style={{ fontSize: '0.95rem', color: '#ea580c' }}>Order with Confidence</h4>
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <p className="text-xs font-bold mb-xs" style={{ color: '#16a34a' }}>✓ 100% Cash on Delivery</p>
              <p className="text-xs text-muted mb-sm" style={{ fontSize: '0.75rem' }}>No upfront card payments. Check your parcel upon doorstep delivery before paying.</p>
              <a 
                href={storeConfig.social.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary btn-full text-xs"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: 'white', minHeight: '38px' }}
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} {storeConfig.storeName} ({storeConfig.domain}). All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/privacy" className="text-xs text-muted hover-text">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-muted hover-text">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
