import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products as localProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { storeConfig } from '../config/store.config';

const Shop = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(1500000);
  const [products, setProducts] = useState(localProducts);
  const { currencySymbol } = storeConfig.settings;

  const initialSearchQuery = searchParams.get('q') || '';

  // Prevent background scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const fbProducts = [];
        querySnapshot.forEach((doc) => {
          fbProducts.push({ id: doc.id, ...doc.data() });
        });
        if (fbProducts.length > 0 && isMounted) {
          const mergedProducts = [...localProducts];
          fbProducts.forEach(fbP => {
            const idx = mergedProducts.findIndex(p => p.id === fbP.id);
            if (idx !== -1) mergedProducts[idx] = fbP;
            else mergedProducts.push(fbP);
          });
          setProducts(mergedProducts);
        }
      } catch (error) {
        console.error("Error fetching products from Firestore:", error);
      }
    };
    fetchProducts();
    return () => { isMounted = false; };
  }, []);
  
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by Category
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Search
    if (initialSearchQuery) {
      const q = initialSearchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q))
      );
    }

    // Filter by Price
    filtered = filtered.filter(p => p.price <= priceRange);

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => a.id.localeCompare(b.id));
    }

    return filtered;
  }, [category, initialSearchQuery, sortBy, priceRange, products]);

  const categories = [
    { name: 'All Products', path: '/shop', count: products.length },
    { name: 'Solar System', path: '/shop/Solar System', count: products.filter(p => p.category === 'Solar System').length },
    { name: 'Home Products', path: '/shop/Home Product', count: products.filter(p => p.category === 'Home Product').length },
  ];

  return (
    <div className="container py-lg">
      <Helmet>
        <title>{category ? `${category} | Taicon Store` : 'All Products | Taicon Store'}</title>
        <meta name="description" content={`Browse our selection of ${category || 'Solar System & Home Products'} at Taicon Store with Cash on Delivery.`} />
      </Helmet>

      {/* Header & Title */}
      <div className="flex justify-between items-center mb-md flex-wrap gap-xs">
        <div>
          <h1 className="text-2xl font-bold">
            {initialSearchQuery ? `Search: "${initialSearchQuery}"` : (category || 'All Products')}
          </h1>
          <p className="text-muted text-xs mt-xs">Showing {filteredProducts.length} items with Cash on Delivery</p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button 
          className="md:hidden btn btn-outline text-xs flex items-center gap-xs"
          style={{ minHeight: '36px', padding: '0.4rem 0.85rem' }}
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <SlidersHorizontal size={14} /> Filter & Sort
        </button>
      </div>

      {/* Horizontal Quick Category Chips (Mobile & Tablet) */}
      <div 
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1rem',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {categories.map(cat => {
          const isActive = (!category && cat.path === '/shop') || (category && cat.path.toLowerCase().includes(category.toLowerCase()));
          return (
            <Link
              key={cat.name}
              to={cat.path}
              style={{
                flexShrink: 0,
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? '#ea580c' : 'var(--bg-secondary)',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                border: `1px solid ${isActive ? '#ea580c' : 'var(--border-color)'}`,
                transition: 'all 0.15s ease'
              }}
            >
              {cat.name} ({cat.count})
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-lg" style={{ alignItems: 'flex-start' }}>
        
        {/* Desktop Sidebar Filters */}
        <aside 
          style={{ width: '250px', flexShrink: 0, position: 'sticky', top: '80px', height: 'fit-content' }} 
          className="hidden md:block"
        >
          <div className="bg-secondary p-md" style={{ borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
            
            {/* Categories Filter */}
            <div className="mb-md">
              <h3 className="font-bold mb-xs text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ea580c' }}>
                Categories
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {categories.map(cat => {
                  const isActive = (!category && cat.path === '/shop') || (category && cat.path.toLowerCase().includes(category.toLowerCase()));
                  return (
                    <li key={cat.name}>
                      <Link 
                        to={cat.path} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                          color: isActive ? '#ea580c' : 'inherit',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.875rem'
                        }}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-muted">({cat.count})</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Sort Filter */}
            <div className="mb-md">
              <h3 className="font-bold mb-xs text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ea580c' }}>
                Sort By
              </h3>
              <select 
                className="input" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '100%', minHeight: '38px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-md">
              <div className="flex justify-between items-center mb-xs">
                <h3 className="font-bold text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ea580c' }}>
                  Max Price
                </h3>
                <span className="text-xs font-semibold">{currencySymbol}{priceRange.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="3000" 
                max="1500000" 
                step="5000"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#ea580c' }}
              />
              <div className="flex justify-between text-xs text-muted mt-xs">
                <span>{currencySymbol}3,000</span>
                <span>{currencySymbol}1,500,000</span>
              </div>
            </div>

            {/* Reset Filter Button */}
            {(category || initialSearchQuery || priceRange < 1500000 || sortBy !== 'featured') && (
              <button 
                className="btn btn-outline w-full text-xs flex items-center justify-center gap-xs"
                style={{ minHeight: '36px' }}
                onClick={() => {
                  setPriceRange(1500000);
                  setSortBy('featured');
                  if (initialSearchQuery) setSearchParams({});
                }}
              >
                <X size={14} /> Reset Filters
              </button>
            )}

          </div>
        </aside>

        {/* Product Grid (2 columns on mobile, 3 on desktop) */}
        <div style={{ flex: 1, width: '100%' }}>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 4} />
              ))}
            </div>
          ) : (
            <div className="text-center bg-secondary" style={{ borderRadius: 'var(--border-radius)', padding: '2.5rem 1rem' }}>
              <h3 className="text-lg font-bold mb-xs">No products found</h3>
              <p className="text-muted text-xs mb-md">No products match your selected category or price filter.</p>
              <Link to="/shop" className="btn btn-primary text-xs">
                View All Products
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Modal Bottom-Sheet Drawer */}
      {isMobileFilterOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          className="md:hidden"
        >
          {/* Backdrop */}
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Bottom Sheet Box */}
          <div 
            style={{
              position: 'relative',
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              padding: '1.25rem',
              zIndex: 1001,
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              animation: 'bottomSheetUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 className="font-bold text-base flex items-center gap-xs">
                <Filter size={18} style={{ color: '#ea580c' }} /> Filter & Sort
              </h3>
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Sort */}
            <div className="mb-md">
              <label className="font-bold text-xs block mb-xs">Sort By</label>
              <select 
                className="input" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Price Slider */}
            <div className="mb-lg">
              <div className="flex justify-between items-center mb-xs">
                <label className="font-bold text-xs">Max Price</label>
                <span className="text-xs font-bold" style={{ color: '#ea580c' }}>{currencySymbol}{priceRange.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="3000" 
                max="1500000" 
                step="5000"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#ea580c' }}
              />
              <div className="flex justify-between text-xs text-muted mt-xs">
                <span>{currencySymbol}3,000</span>
                <span>{currencySymbol}1,500,000</span>
              </div>
            </div>

            <div className="flex gap-sm">
              <button 
                className="btn btn-outline flex-1 text-xs"
                onClick={() => {
                  setPriceRange(1500000);
                  setSortBy('featured');
                  setIsMobileFilterOpen(false);
                }}
              >
                Reset
              </button>
              <button 
                className="btn btn-primary flex-1 text-xs"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes bottomSheetUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}} />
        </div>
      )}
    </div>
  );
};

export default Shop;
