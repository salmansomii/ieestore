import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { products as localProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Shop = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(100);
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(true);

  const initialSearchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const fbProducts = [];
        querySnapshot.forEach((doc) => {
          fbProducts.push({ id: doc.id, ...doc.data() });
        });
        if (fbProducts.length > 0) {
          setProducts(fbProducts);
        }
      } catch (error) {
        console.error("Error fetching products from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by Category
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by Search
    if (initialSearchQuery) {
      const q = initialSearchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
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
      default: // featured / newest (using id for demo)
        filtered.sort((a, b) => a.id.localeCompare(b.id));
    }

    return filtered;
  }, [category, initialSearchQuery, sortBy, priceRange]);

  return (
    <div className="container py-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-lg flex-wrap gap-sm">
        <h1 className="text-3xl">
          {initialSearchQuery ? `Search: "${initialSearchQuery}"` : (category || 'Shop All')}
        </h1>
        <p className="text-muted">{filteredProducts.length} products</p>
      </div>

      <div className="flex gap-lg" style={{ alignItems: 'flex-start' }}>
        
        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden btn btn-outline mb-md w-full"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
          <Filter size={18} style={{ marginRight: '8px' }}/> Filter & Sort
        </button>

        {/* Sidebar Filters */}
        <aside 
          style={{ width: '250px', flexShrink: 0, position: 'sticky', top: '100px', height: 'fit-content' }} 
          className={`md:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}
        >
          <div>
            
            <div className="mb-lg">
              <h3 className="font-semibold mb-sm">Sort By</h3>
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

            <div className="mb-lg">
              <h3 className="font-semibold mb-sm">Max Price: ${priceRange}</h3>
              <input 
                type="range" 
                min="0" 
                max="200" 
                step="5"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mb-lg">
              <h3 className="font-semibold mb-sm">Categories</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><a href="/shop" className={`${!category ? 'font-bold' : 'text-muted'}`}>All Products</a></li>
                <li><a href="/shop/Baby" className={`${category === 'Baby' ? 'font-bold' : 'text-muted'}`}>Baby</a></li>
                <li><a href="/shop/Christmas" className={`${category === 'Christmas' ? 'font-bold' : 'text-muted'}`}>Christmas</a></li>
                <li><a href="/shop/Home Product" className={`${category === 'Home Product' ? 'font-bold' : 'text-muted'}`}>Home Product</a></li>
              </ul>
            </div>
            
            {(category || initialSearchQuery || priceRange < 200 || sortBy !== 'featured') && (
              <button 
                className="btn btn-outline w-full mt-md"
                onClick={() => {
                  setPriceRange(200);
                  setSortBy('featured');
                  if (initialSearchQuery) setSearchParams({});
                  if (category) window.location.href = '/shop';
                }}
              >
                Clear Filters
              </button>
            )}

          </div>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-3 gap-md">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-xxl bg-secondary" style={{ borderRadius: 'var(--border-radius)' }}>
              <h3 className="text-xl mb-sm">No products found</h3>
              <p className="text-muted">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Shop;
