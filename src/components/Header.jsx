import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { storeConfig } from '../config/store.config';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'Baby', path: '/shop/Baby' },
    { name: 'Christmas', path: '/shop/Christmas' },
    { name: 'Home Product', path: '/shop/Home Product' },
    { name: 'Fashion', path: '/shop/Fashion' },
  ];

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ padding: '8px' }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/iee-logo-transparent.png" alt="IEE Logo" style={{ height: '60px' }} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block" style={{ display: 'none' }} >
          <ul style={{ display: 'flex', gap: '2rem' }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} style={{ fontWeight: 500, fontSize: '0.95rem' }} className="nav-link">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <form onSubmit={handleSearch} className="hidden md:block" style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                paddingRight: '2.5rem',
                borderRadius: '999px',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                outline: 'none',
                width: '200px'
              }}
            />
            <button type="submit" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Search size={18} />
            </button>
          </form>



          {isAdmin && (
            <Link to="/admin" style={{ color: 'var(--text-primary)' }} className="hidden md:block" title="Admin Dashboard">
              <Shield size={24} />
            </Link>
          )}
          
          <Link to="/cart" style={{ position: 'relative', color: 'var(--text-primary)', padding: '4px' }}>
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: 'var(--danger-color)',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden" style={{
          position: 'absolute',
          top: '80px',
          left: 0,
          width: '100%',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem var(--spacing-md)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '1rem' }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingRight: '2.5rem' }}
            />
            <button type="submit" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Search size={20} />
            </button>
          </form>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  style={{ display: 'block', fontSize: '1.1rem', fontWeight: 500, padding: '0.5rem 0' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .md\\:block { display: block !important; }
          .md\\:hidden { display: none !important; }
        }
        .nav-link:hover { color: var(--text-secondary); }
      `}} />
    </header>
  );
};

export default Header;
