import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Headphones, Zap, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { products as localProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [products, setProducts] = useState(localProducts);
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      image: '/product_images/herobaner1.png',
      alt: 'Taicon Home Products - Smart Home Better Living',
      link: '/shop/Home Product'
    },
    {
      id: 2,
      image: '/product_images/herobanner2.png',
      alt: 'Taicon Solar Energy - Clean Energy Brighter Future',
      link: '/shop/Solar System'
    }
  ];

  // Auto-play hero banner slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  // Fetch Firestore products if any
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
          fbProducts.forEach((fbP) => {
            const idx = mergedProducts.findIndex((p) => p.id === fbP.id);
            if (idx !== -1) mergedProducts[idx] = fbP;
            else mergedProducts.push(fbP);
          });
          setProducts(mergedProducts);
        }
      } catch (error) {
        console.error('Error fetching products from Firestore:', error);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const solarProducts = products.filter((p) => p.category === 'Solar System');
  const homeProducts = products.filter((p) => p.category === 'Home Product');

  return (
    <div>
      <Helmet>
        <title>Taicon Store | Solar Energy Systems & Home Products</title>
        <meta
          name="description"
          content="Shop high efficiency Solar Panels, Hybrid Inverters, Lithium Batteries, and premium Home Appliances with Cash on Delivery at Taicon Store."
        />
      </Helmet>

      {/* Hero Banner Slider - No text overlay on images */}
      <section style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        <div style={{ position: 'relative', width: '100%', display: 'flex', transition: 'transform 0.6s ease-in-out' }}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              style={{
                minWidth: '100%',
                display: index === currentSlide ? 'block' : 'none',
                position: 'relative'
              }}
            >
              <Link to={banner.link} style={{ display: 'block', width: '100%' }} aria-label={banner.alt}>
                <img
                  src={banner.image}
                  alt={banner.alt}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '620px',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.75)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.45)')}
        >
          <ChevronLeft size={26} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.75)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.45)')}
        >
          <ChevronRight size={26} />
        </button>

        {/* Indicators Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 10
          }}
        >
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
              style={{
                width: currentSlide === index ? '28px' : '10px',
                height: '10px',
                borderRadius: '999px',
                backgroundColor: currentSlide === index ? '#f97316' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>

      {/* Feature Badges */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '1.75rem 0' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Truck size={28} style={{ color: '#ea580c' }} />
              <div style={{ textAlign: 'left' }}>
                <p className="font-bold text-sm" style={{ margin: 0 }}>Cash on Delivery</p>
                <p className="text-xs text-muted" style={{ margin: 0 }}>Pay at your doorstep</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <ShieldCheck size={28} style={{ color: '#ea580c' }} />
              <div style={{ textAlign: 'left' }}>
                <p className="font-bold text-sm" style={{ margin: 0 }}>100% Genuine</p>
                <p className="text-xs text-muted" style={{ margin: 0 }}>Official Brand Warranty</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Zap size={28} style={{ color: '#ea580c' }} />
              <div style={{ textAlign: 'left' }}>
                <p className="font-bold text-sm" style={{ margin: 0 }}>Tier-1 Solar Tech</p>
                <p className="text-xs text-muted" style={{ margin: 0 }}>High Efficiency Systems</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Headphones size={28} style={{ color: '#ea580c' }} />
              <div style={{ textAlign: 'left' }}>
                <p className="font-bold text-sm" style={{ margin: 0 }}>Fast Support</p>
                <p className="text-xs text-muted" style={{ margin: 0 }}>Direct Call & WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-xl">
            <h2 className="text-3xl font-bold mb-xs">Explore Categories</h2>
            <p className="text-muted">Choose from our premium solar energy packages and smart home appliances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Solar System Category Card */}
            <Link
              to="/shop/Solar System"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'block',
                textDecoration: 'none',
                height: '320px',
                backgroundColor: '#1e293b'
              }}
              className="cat-card-hover"
            >
              <img
                src="/product_images/herobanner2.png"
                alt="Solar System"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'transform 0.5s ease'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                  color: 'white'
                }}
              >
                <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, width: 'fit-content', marginBottom: '8px' }}>
                  CLEAN ENERGY
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0' }}>Solar System</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>Solar Panels, Hybrid Inverters, Lithium Batteries & Complete Solutions</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fb923c', fontWeight: 600, marginTop: '12px', fontSize: '0.95rem' }}>
                  View All Solar Products <ArrowRight size={18} />
                </span>
              </div>
            </Link>

            {/* Home Product Category Card */}
            <Link
              to="/shop/Home Product"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'block',
                textDecoration: 'none',
                height: '320px',
                backgroundColor: '#1e293b'
              }}
              className="cat-card-hover"
            >
              <img
                src="/product_images/herobaner1.png"
                alt="Home Product"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'transform 0.5s ease'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                  color: 'white'
                }}
              >
                <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, width: 'fit-content', marginBottom: '8px' }}>
                  SMART LIVING
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0' }}>Home Products</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>Inverter Refrigerators, Smart TVs, DC Inverter ACs, Kitchen Appliances</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#fb923c', fontWeight: 600, marginTop: '12px', fontSize: '0.95rem' }}>
                  View All Home Products <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Solar Systems */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="flex justify-between items-center mb-lg flex-wrap gap-sm">
            <div>
              <h2 className="text-2xl font-bold">Solar System Products</h2>
              <p className="text-sm text-muted">Tier-1 solar panels, hybrid inverters & lithium energy storage</p>
            </div>
            <Link to="/shop/Solar System" className="text-muted hover-text font-medium flex items-center gap-xs">
              View All Solar <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {solarProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Home Products */}
      <section className="section">
        <div className="container">
          <div className="flex justify-between items-center mb-lg flex-wrap gap-sm">
            <div>
              <h2 className="text-2xl font-bold">Home Products</h2>
              <p className="text-sm text-muted">Quality electronic & kitchen appliances built for modern homes</p>
            </div>
            <Link to="/shop/Home Product" className="text-muted hover-text font-medium flex items-center gap-xs">
              View All Home Products <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {homeProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Cash on Delivery Callout Banner */}
      <section style={{ backgroundColor: '#ea580c', color: 'white', padding: '3.5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="text-3xl font-bold mb-md">Cash on Delivery Available Nationwide</h2>
          <p className="text-lg mb-lg" style={{ opacity: 0.95 }}>
            Order online with complete peace of mind. Check your products upon doorstep delivery and pay in cash!
          </p>
          <div className="flex justify-center gap-md flex-wrap">
            <Link to="/shop" className="btn" style={{ backgroundColor: 'white', color: '#ea580c', fontWeight: 700, padding: '0.875rem 2rem' }}>
              Shop Now
            </Link>
            <a
              href="https://wa.me/923274000155"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ backgroundColor: 'rgba(0,0,0,0.25)', color: 'white', fontWeight: 600, padding: '0.875rem 2rem' }}
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        .cat-card-hover:hover img {
          transform: scale(1.05);
        }
        @media (min-width: 768px) {
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      `}} />
    </div>
  );
};

export default Home;
