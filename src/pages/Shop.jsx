import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products as localProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Filter, X } from 'lucide-react';
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
    <div className="container py-xl">
      <Helmet>
        <title>{category ? `${category} | Taicon Store` : 'All Products | Taicon Store'}</title>
        <meta name="description" content={`Browse our selection of ${category || 'Solar System & Home Products'} at Taicon Store with Cash on Delivery.`} />
      </Helmet>

      {/* Header */}
      <div className="flex justify-between items-center mb-lg flex-wrap gap-sm">
        <div>
          <h1 className="text-3xl font-bold">
            {initialSearchQuery ? `Search Results: "${initialSearchQuery}"` : (category || 'All Products')}
          </h1>
          <p className="text-muted text-sm mt-xs">Showing {filteredProducts.length} items available with Cash on Delivery</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-lg" style={{ alignItems: 'flex-start' }}>
        
        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden btn btn-outline mb-md w-full flex items-center justify-center gap-xs"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
          <Filter size={18} /> {isMobileFilterOpen ? 'Close Filters' : 'Filter & Sort'}
        </button>

        {/* Sidebar Filters */}
        <aside 
          style={{ width: '260px', flexShrink: 0, position: 'sticky', top: '100px', height: 'fit-content' }} 
          className={`md:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}
        >
          <div className="bg-secondary p-lg" style={{ borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
            
            {/* Categories Filter */}
            <div className="mb-lg">
              <h3 className="font-bold mb-sm text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ea580c' }}>
                Categories
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
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
                          padding: '6px 10px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          backgroundColor: isActive ? 'rgba(234, 88, 12, 0.1)' : 'transparent',
                          color: isActive ? '#ea580c' : 'inherit',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.95rem'
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
            <div className="mb-lg">
              <h3 className="font-bold mb-sm text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ea580c' }}>
                Sort By
              </h3>
              <select 
                className="input" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-lg">
              <div className="flex justify-between items-center mb-xs">
                <h3 className="font-bold text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ea580c' }}>
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
                className="btn btn-outline w-full text-sm flex items-center justify-center gap-xs"
                onClick={() => {
                  setPriceRange(1500000);
                  setSortBy('featured');
                  if (initialSearchQuery) setSearchParams({});
                }}
              >
                <X size={16} /> Reset Filters
              </button>
            )}

          </div>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-xxl bg-secondary" style={{ borderRadius: 'var(--border-radius)', padding: '3rem 1.5rem' }}>
              <h3 className="text-xl font-bold mb-sm">No products found</h3>
              <p className="text-muted mb-md">No products match your selected category or filter options.</p>
              <Link to="/shop" className="btn btn-primary">
                View All Products
              </Link>
            </div>
          )}
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      `}} />
    </div>
  );
};

export default Shop;
