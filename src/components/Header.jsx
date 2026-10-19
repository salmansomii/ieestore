import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Shield, Phone, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { storeConfig } from '../config/store.config';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisibleMobile, setIsSearchVisibleMobile] = useState(false);
  const { cartCount } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
      setIsSearchVisibleMobile(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Solar System', path: '/shop/Solar System', highlight: true },
    { name: 'Home Products', path: '/shop/Home Product' },
    { name: 'All Products', path: '/shop' },
  ];

  return (
    <>
      {/* Top Notification Bar for Cash on Delivery */}
      <div 
        style={{ 
          backgroundColor: '#0f172a', 
          color: '#f8fafc', 
          padding: '6px 12px', 
          fontSize: '0.75rem', 
          textAlign: 'center',
          fontWeight: 600,
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <Sparkles size={14} style={{ color: '#ea580c' }} />
        <span>Cash on Delivery Available Across Pakistan • Fast Verification</span>
      </div>

      <header 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 80, 
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div 
          className="container" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            height: '64px' 
          }}
        >
          {/* Left: Mobile Menu Toggle & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="md:hidden" 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              style={{ 
                padding: '8px', 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/taicon-logo.png" 
                alt="Taicon Store" 
                style={{ height: '44px', width: 'auto', objectFit: 'contain' }} 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'block';
                }}
              />
              <span style={{ display: 'none', fontSize: '1.35rem', fontWeight: 800, color: '#ea580c' }}>TAICON</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:block">
            <ul style={{ display: 'flex', gap: '1.75rem', listStyle: 'none', margin: 0, padding: 0 }}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    style={{ 
                      fontWeight: 600, 
                      fontSize: '0.925rem', 
                      textDecoration: 'none',
                      color: location.pathname === link.path ? '#ea580c' : 'inherit'
                    }} 
                    className="hover-text"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {/* Desktop Search Form */}
            <form onSubmit={handleSearch} className="hidden md:block" style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.45rem 1rem',
                  paddingRight: '2.25rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  width: '200px',
                  backgroundColor: 'var(--bg-secondary)',
                  transition: 'width 0.2s, border-color 0.2s'
                }}
              />
              <button 
                type="submit" 
                aria-label="Search"
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: 'var(--text-secondary)' 
                }}
              >
                <Search size={16} />
              </button>
            </form>

            {/* Mobile Search Toggle */}
            <button 
              className="md:hidden"
              onClick={() => setIsSearchVisibleMobile(!isSearchVisibleMobile)}
              aria-label="Toggle search bar"
              style={{ padding: '8px', color: 'var(--text-primary)' }}
            >
              <Search size={21} />
            </button>

            {/* Admin Shield Icon */}
            {isAdmin && (
              <Link 
                to="/order" 
                style={{ color: '#ea580c', padding: '6px' }} 
                className="hidden md:block" 
                title="Admin Orders Dashboard"
              >
                <Shield size={22} />
              </Link>
            )}
            
            {/* Cart Icon */}
            <Link 
              to="/cart" 
              style={{ 
                position: 'relative', 
                color: 'var(--text-primary)', 
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={23} />
              {cartCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: '#ea580c',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Search Input (when search button clicked) */}
        {isSearchVisibleMobile && (
          <div 
            className="md:hidden" 
            style={{ 
              padding: '0.5rem 1rem 0.75rem', 
              backgroundColor: 'var(--bg-primary)', 
              borderTop: '1px solid var(--border-color)' 
            }}
          >
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input 
                type="text" 
                autoFocus
                placeholder="Search solar panels, inverters, appliances..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{ paddingRight: '2.5rem', minHeight: '42px' }}
              />
              <button 
                type="submit" 
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#ea580c' 
                }}
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Slide-Over Drawer Navigation */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
          }}
          className="md:hidden"
        >
          {/* Backdrop Overlay */}
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              transition: 'opacity 0.25s ease'
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Menu Content */}
          <div 
            style={{
              position: 'relative',
              width: '82%',
              maxWidth: '320px',
              height: '100%',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1001,
              animation: 'drawerSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Drawer Header */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)'
              }}
            >
              <img src="/taicon-logo.png" alt="Taicon Store" style={{ height: '38px', width: 'auto' }} />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: '6px', color: 'var(--text-secondary)' }}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Drawer Search */}
            <div style={{ padding: '1rem 1rem 0.5rem' }}>
              <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input"
                  style={{ paddingRight: '2.5rem', minHeight: '40px', fontSize: '15px' }}
                />
                <button 
                  type="submit" 
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#ea580c' 
                  }}
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Navigation Links */}
            <div style={{ padding: '0.75rem 1rem', flex: 1 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Store Navigation
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.75rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: location.pathname === link.path ? '#ea580c' : 'var(--text-primary)',
                        backgroundColor: location.pathname === link.path ? 'var(--accent-light)' : 'transparent',
                        textDecoration: 'none'
                      }}
                    >
                      <span>{link.name}</span>
                      {link.highlight && (
                        <span style={{ fontSize: '0.7rem', backgroundColor: '#ea580c', color: 'white', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                          HOT
                        </span>
                      )}
                    </Link>
                  </li>
                ))}

                {isAdmin && (
                  <li>
                    <Link 
                      to="/order" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        padding: '0.75rem 0.75rem', 
                        borderRadius: '8px', 
                        color: '#ea580c', 
                        fontWeight: 700, 
                        fontSize: '0.95rem',
                        backgroundColor: 'var(--accent-light)' 
                      }}
                    >
                      <Shield size={18} /> Admin Orders Portal
                    </Link>
                  </li>
                )}
              </ul>

              {/* Informational Links */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  Help & Information
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Link to="/shipping" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', padding: '4px 0' }}>Shipping & COD</Link>
                  <Link to="/returns" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', padding: '4px 0' }}>Warranty & Returns</Link>
                  <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', padding: '4px 0' }}>FAQ</Link>
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', padding: '4px 0' }}>Contact Us</Link>
                </div>
              </div>
            </div>

            {/* Bottom Support Section in Drawer */}
            <div 
              style={{ 
                padding: '1rem', 
                borderTop: '1px solid var(--border-color)', 
                backgroundColor: 'var(--bg-secondary)' 
              }}
            >
              <a 
                href={storeConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-full text-sm"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366', minHeight: '40px' }}
              >
                <Phone size={16} /> WhatsApp Order Support
              </a>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes drawerSlideIn {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
          `}} />
        </div>
      )}
    </>
  );
};

export default Header;
