import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const Home = () => {
  // Demo filtering for sections
  const bestSellers = products.filter(p => p.rating >= 4.8).slice(0, 4);
  const newArrivals = products.filter(p => p.category === 'Home Product').slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '600px', 
        display: 'flex', 
        alignItems: 'center',
        backgroundImage: 'url("/hero_banner.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '600px', color: 'white' }}>
            <h1 className="text-3xl mb-md" style={{ fontSize: '3.5rem', fontWeight: 800 }}>
              Premium Essentials for Modern Families
            </h1>
            <p className="text-lg mb-lg" style={{ opacity: 0.9 }}>
              Discover our curated collection of high-quality baby products, stunning seasonal decor, and home products up to 70% off retail.
            </p>
            <Link to="/shop" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Shop Now <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section bg-secondary">
        <div className="container">
          <h2 className="text-2xl text-center mb-xl">Shop by Category</h2>
          <div className="grid grid-cols-3 gap-md">
            <Link to="/shop/Baby" className="category-card" style={{ position: 'relative', height: '300px', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
              <img src="/product_images/product_2.jpg" alt="Baby" className="w-full h-full object-contain" />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>Baby</h3>
              </div>
            </Link>
            <Link to="/shop/Christmas" className="category-card" style={{ position: 'relative', height: '300px', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
              <img src="/product_images/product_3.webp" alt="Christmas" className="w-full h-full object-contain" />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>Christmas</h3>
              </div>
            </Link>
            <Link to="/shop/Home Product" className="category-card" style={{ position: 'relative', height: '300px', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
              <img src="/product_images/product_7.jpg" alt="Home Product" className="w-full h-full object-contain" />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>Home Product</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section">
        <div className="container">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="text-2xl">Best Sellers</h2>
            <Link to="/shop" className="text-muted hover-text font-medium" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-md">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section style={{ backgroundColor: 'var(--accent-color)', color: 'white', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="text-3xl mb-md">Special Offer</h2>
          <p className="text-lg mb-lg">Get up to 70% off on all premium Christmas decorations this week!</p>
          <Link to="/shop/Christmas" className="btn" style={{ backgroundColor: 'white', color: 'var(--accent-color)' }}>
            Shop the Sale
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <h2 className="text-2xl text-center mb-xl">New Arrivals</h2>
          <div className="grid grid-cols-4 gap-md">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        .category-card img { transition: transform 0.5s ease; }
        .category-card:hover img { transform: scale(1.1); }
      `}} />
    </div>
  );
};

export default Home;
