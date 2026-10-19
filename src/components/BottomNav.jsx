import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingBag, MessageCircle, PackageCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { storeConfig } from '../config/store.config';

const BottomNav = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shop', path: '/shop', icon: Compass },
    { 
      label: 'WhatsApp', 
      isExternal: true, 
      path: storeConfig.social.whatsapp || 'https://wa.me/923274000155', 
      icon: MessageCircle 
    },
    { 
      label: 'Cart', 
      path: '/cart', 
      icon: ShoppingBag, 
      badge: cartCount 
    },
    { label: 'Orders', path: '/order', icon: PackageCheck },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--bottom-nav-height)',
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 90,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      }}
      className="md:hidden"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = !item.isExternal && isActive(item.path);

        const content = (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '6px 0',
              color: active ? '#ea580c' : '#64748b',
              position: 'relative',
              transition: 'color 0.15s ease',
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={21} strokeWidth={active ? 2.5 : 1.9} />
              {item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-9px',
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '0.675rem',
                fontWeight: active ? 700 : 500,
                marginTop: '3px',
                letterSpacing: '-0.01em',
              }}
            >
              {item.label}
            </span>
          </div>
        );

        if (item.isExternal) {
          return (
            <a
              key={item.label}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, textDecoration: 'none' }}
              aria-label={item.label}
            >
              {content}
            </a>
          );
        }

        return (
          <Link
            key={item.label}
            to={item.path}
            style={{ flex: 1, textDecoration: 'none' }}
            aria-label={item.label}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
