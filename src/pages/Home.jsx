import { useState, useEffect, useRef } from 'react';
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
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  // Touch swipe handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      nextSlide(); // Swiped left -> Next
    } else if (diff < -45) {
      prevSlide(); // Swiped right -> Prev
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
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

      {/* Hero Banner Slider with Touch Swipe & Smooth Slide Transition */}
      <section 
        style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#0f172a' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          style={{ 
            display: 'flex', 
            width: `${banners.length * 100}%`,
            transform: `translateX(-${currentSlide * (100 / banners.length)}%)`,
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform'
          }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              style={{
                width: `${100 / banners.length}%`,
                flexShrink: 0,
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
                    maxHeight: '580px',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto'
                  }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Previous Button (Hidden on tiny screens or subtle) */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            color: 'white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            color: 'white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Indicators Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 10
          }}
        >
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
              style={{
                width: currentSlide === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                backgroundColor: currentSlide === index ? '#ea580c' : 'rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>

      {/* Feature Badges - Mobile Optimized */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '1.25rem 0' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.25rem' }}>
              <Truck size={24} style={{ color: '#ea580c', flexShrink: 0 }} />
              <div>
                <p className="font-bold text-xs" style={{ margin: 0 }}>Cash on Delivery</p>
                <p className="text-xs text-muted" style={{ margin: 0, fontSize: '0.7rem' }}>Pay at doorstep</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.25rem' }}>
              <ShieldCheck size={24} style={{ color: '#ea580c', flexShrink: 0 }} />
              <div>
                <p className="font-bold text-xs" style={{ margin: 0 }}>100% Genuine</p>
                <p className="text-xs text-muted" style={{ margin: 0, fontSize: '0.7rem' }}>Brand Warranty</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.25rem' }}>
              <Zap size={24} style={{ color: '#ea580c', flexShrink: 0 }} />
              <div>
                <p className="font-bold text-xs" style={{ margin: 0 }}>Tier-1 Solar</p>
                <p className="text-xs text-muted" style={{ margin: 0, fontSize: '0.7rem' }}>High Efficiency</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.25rem' }}>
              <Headphones size={24} style={{ color: '#ea580c', flexShrink: 0 }} />
              <div>
                <p className="font-bold text-xs" style={{ margin: 0 }}>Fast Support</p>
                <p className="text-xs text-muted" style={{ margin: 0, fontSize: '0.7rem' }}>Direct WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-lg">
            <h2 className="text-2xl font-bold mb-xs">Explore Categories</h2>
            <p className="text-muted text-sm">Choose from our premium solar energy packages and smart home appliances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Solar System Category Card */}
            <Link
              to="/shop/Solar System"
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                display: 'block',
                textDecoration: 'none',
                minHeight: '220px',
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
                  minHeight: '220px',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                loading="lazy"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.25rem',
                  color: 'white'
                }}
              >
                <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '3px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, width: 'fit-content', marginBottom: '6px' }}>
                  CLEAN ENERGY
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px 0', color: 'white' }}>Solar Systems</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.8rem' }}>Solar Panels, Hybrid Inverters & Lithium Batteries</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#fb923c', fontWeight: 600, marginTop: '8px', fontSize: '0.85rem' }}>
                  Explore Solar <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            {/* Home Product Category Card */}
            <Link
              to="/shop/Home Product"
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                display: 'block',
                textDecoration: 'none',
                minHeight: '220px',
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
                  minHeight: '220px',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                loading="lazy"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.25rem',
                  color: 'white'
                }}
              >
                <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '3px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, width: 'fit-content', marginBottom: '6px' }}>
                  SMART LIVING
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px 0', color: 'white' }}>Home Products</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.8rem' }}>Electric Water Heating Rods, Smart Living & Home Appliances</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#fb923c', fontWeight: 600, marginTop: '8px', fontSize: '0.85rem' }}>
                  Explore Home Products <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Solar Systems - 2 Column on Mobile! */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="flex justify-between items-center mb-md flex-wrap gap-xs">
            <div>
              <h2 className="text-xl font-bold">Solar System Products</h2>
              <p className="text-xs text-muted">Tier-1 solar panels, hybrid inverters & storage</p>
            </div>
            <Link to="/shop/Solar System" className="text-primary-color font-semibold text-xs flex items-center gap-xs">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="product-grid">
            {solarProducts.slice(0, 6).map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Home Products - 2 Column on Mobile! */}
      <section className="section">
        <div className="container">
          <div className="flex justify-between items-center mb-md flex-wrap gap-xs">
            <div>
              <h2 className="text-xl font-bold">Home Products</h2>
              <p className="text-xs text-muted">Quality electronic & kitchen appliances</p>
            </div>
            <Link to="/shop/Home Product" className="text-primary-color font-semibold text-xs flex items-center gap-xs">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="product-grid">
            {homeProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Cash on Delivery Banner */}
      <section style={{ backgroundColor: '#ea580c', color: 'white', padding: '2.75rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <h2 className="text-2xl font-bold mb-sm" style={{ color: 'white' }}>Cash on Delivery Across Pakistan</h2>
          <p className="text-sm mb-lg" style={{ opacity: 0.95, lineHeight: 1.6 }}>
            Order online with complete peace of mind. Check your items upon doorstep delivery and pay in cash!
          </p>
          <div className="flex justify-center gap-sm flex-wrap">
            <Link to="/shop" className="btn" style={{ backgroundColor: 'white', color: '#ea580c', fontWeight: 700, padding: '0.75rem 1.75rem' }}>
              Shop Now
            </Link>
            <a
              href="https://wa.me/923274000155"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ backgroundColor: 'rgba(0,0,0,0.25)', color: 'white', fontWeight: 600, padding: '0.75rem 1.75rem' }}
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
