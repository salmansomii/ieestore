import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products as localProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { storeConfig } from '../config/store.config';
import { Check, Shield, Truck, MessageSquare, ArrowLeft, Plus, ShoppingBag, ChevronLeft, ChevronRight, Play, Maximize2, X } from 'lucide-react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, showToast } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { currencySymbol } = storeConfig.settings;

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && isMounted) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else if (isMounted) {
          const localMatch = localProducts.find(p => p.id === id) || localProducts[0];
          if (localMatch) setProduct(localMatch);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (isMounted) {
          const localMatch = localProducts.find(p => p.id === id) || localProducts[0];
          if (localMatch) setProduct(localMatch);
        }
      } finally {
        if (isMounted) {
          setSelectedImageIndex(0);
          setIsVideoActive(false);
          setLoading(false);
        }
      }
    };
    fetchProduct();
    return () => { isMounted = false; };
  }, [id]);

  // Lock body scroll and handle keyboard navigation when Lightbox is open
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, selectedImageIndex]);

  if (loading) {
    return (
      <div className="container py-xxl text-center">
        <div className="flex justify-center items-center py-xl">
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#ea580c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <p className="text-muted text-sm mt-sm">Loading product details...</p>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-xxl text-center">
        <h2 className="text-2xl font-bold mb-md">Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const currentImage = productImages[selectedImageIndex] || product.image;

  const handleNextImage = () => {
    setIsVideoActive(false);
    setSelectedImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setIsVideoActive(false);
    setSelectedImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      handleNextImage(); // swipe left
    } else if (diff < -40) {
      handlePrevImage(); // swipe right
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleSelection = (variationName, option) => {
    setSelections(prev => ({ ...prev, [variationName]: option }));
  };

  const isVariationSelected = () => {
    if (!product.variations || product.variations.length === 0) return true;
    return product.variations.every(v => selections[v.name]);
  };

  const handleAddToCart = () => {
    if (!isVariationSelected()) {
      showToast('Please select all product options.', 'info');
      return;
    }
    addToCart(product, quantity, Object.keys(selections).length ? selections : null);
  };

  const handleBuyNow = () => {
    if (!isVariationSelected()) {
      showToast('Please select all product options.', 'info');
      return;
    }
    addToCart(product, quantity, Object.keys(selections).length ? selections : null);
    navigate('/checkout');
  };

  return (
    <div className="container py-lg" style={{ paddingBottom: '5rem' }}>
      <Helmet>
        <title>{product.name} | Taicon Store</title>
        <meta name="description" content={product.description.substring(0, 150) + '...'} />
      </Helmet>

      {/* Back Link */}
      <div className="mb-md">
        <Link to="/shop" className="text-muted hover-text flex items-center gap-xs font-semibold text-xs">
          <ArrowLeft size={14} /> Back to Products
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-lg" style={{ alignItems: 'flex-start' }}>
        
        {/* Amazon-Style Product Image & Video Gallery */}
        <div>
          {/* Quick Media Mode Switcher */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={() => setIsVideoActive(false)}
              className={`btn text-xs ${!isVideoActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                padding: '0.4rem 0.85rem', 
                minHeight: '34px', 
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              📷 Photos ({productImages.length})
            </button>
            {product.video && (
              <button
                type="button"
                onClick={() => setIsVideoActive(true)}
                className={`btn text-xs ${isVideoActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  padding: '0.4rem 0.85rem', 
                  minHeight: '34px', 
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Play size={13} fill={isVideoActive ? "white" : "#ea580c"} style={{ color: isVideoActive ? 'white' : '#ea580c' }} /> 
                Watch Video (ویڈیو)
              </button>
            )}
          </div>

          {/* Main Showcase Image or Video */}
          <div 
            style={{ 
              position: 'relative', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              backgroundColor: isVideoActive ? '#000000' : '#ffffff', 
              aspectRatio: isVideoActive ? '16/9' : '1/1', 
              border: '1px solid var(--border-color)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: isVideoActive ? 0 : '0.35rem',
              boxShadow: 'var(--shadow-sm)',
              userSelect: 'none',
              cursor: isVideoActive ? 'default' : 'zoom-in'
            }}
            onClick={() => {
              if (!isVideoActive) setIsLightboxOpen(true);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {isVideoActive && product.video ? (
              <video 
                key={product.video}
                src={product.video} 
                controls 
                autoPlay 
                playsInline 
                preload="metadata"
                poster={product.image}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  backgroundColor: '#000000',
                  borderRadius: '14px'
                }}
              />
            ) : (
              <img 
                key={currentImage}
                src={currentImage} 
                alt={`${product.name} view ${selectedImageIndex + 1}`} 
                className="w-full h-full"
                style={{ 
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  transition: 'opacity 0.25s ease-in-out',
                  animation: 'imgFade 0.25s ease'
                }}
                fetchpriority="high"
              />
            )}

            {/* Discount Badge */}
            {product.discountPercentage > 0 && !isVideoActive && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '12px', 
                  backgroundColor: '#ea580c', 
                  color: 'white', 
                  padding: '3px 10px', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  zIndex: 4
                }}
              >
                Save {product.discountPercentage}%
              </div>
            )}

            {/* Full Screen Zoom Button Badge */}
            {!isVideoActive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  zIndex: 5
                }}
                title="Click to view full image (پوری تصویر دیکھیں)"
              >
                <Maximize2 size={13} /> Full View
              </button>
            )}

            {/* Image Counter Badge */}
            {!isVideoActive && productImages.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  color: '#ffffff',
                  padding: '3px 9px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)',
                  zIndex: 4
                }}
              >
                {selectedImageIndex + 1} / {productImages.length}
              </div>
            )}

            {/* Previous Image Arrow (if multiple images) */}
            {!isVideoActive && productImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#0f172a',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  zIndex: 4
                }}
                aria-label="Previous Image"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Next Image Arrow (if multiple images) */}
            {!isVideoActive && productImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#0f172a',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  zIndex: 4
                }}
                aria-label="Next Image"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Amazon-Style Thumbnails Row Below Main Image */}
          {(productImages.length > 1 || product.video) && (
            <div 
              style={{ 
                display: 'flex', 
                gap: '0.625rem', 
                marginTop: '0.875rem',
                overflowX: 'auto',
                paddingBottom: '4px',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none'
              }}
            >
              {productImages.map((img, idx) => {
                const isSelected = !isVideoActive && selectedImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsVideoActive(false);
                      setSelectedImageIndex(idx);
                    }}
                    onMouseEnter={() => {
                      setIsVideoActive(false);
                      setSelectedImageIndex(idx);
                    }}
                    style={{
                      width: '72px',
                      height: '72px',
                      flexShrink: 0,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      border: isSelected ? '2px solid #ea580c' : '1px solid var(--border-color)',
                      boxShadow: isSelected ? '0 0 0 2px rgba(234, 88, 12, 0.2)' : 'none',
                      opacity: isSelected ? 1 : 0.7,
                      padding: '3px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)'
                    }}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain' 
                      }} 
                    />
                  </button>
                );
              })}

              {/* Video Thumbnail Button */}
              {product.video && (
                <button
                  type="button"
                  onClick={() => setIsVideoActive(true)}
                  style={{
                    width: '72px',
                    height: '72px',
                    flexShrink: 0,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#0f172a',
                    border: isVideoActive ? '2px solid #ea580c' : '1px solid var(--border-color)',
                    boxShadow: isVideoActive ? '0 0 0 2px rgba(234, 88, 12, 0.2)' : 'none',
                    opacity: isVideoActive ? 1 : 0.85,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    color: '#ffffff',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    transform: isVideoActive ? 'scale(1.03)' : 'scale(1)',
                    position: 'relative'
                  }}
                  aria-label="Play product video"
                >
                  <img 
                    src={product.image} 
                    alt="Video preview" 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', opacity: 0.35 }} 
                  />
                  <div 
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#ea580c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                    }}
                  >
                    <Play size={14} fill="white" style={{ marginLeft: '2px' }} />
                  </div>
                  <span style={{ position: 'relative', zIndex: 2, fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.04em' }}>VIDEO</span>
                </button>
              )}
            </div>
          )}

          {/* Full Screen Image Lightbox Modal */}
          {isLightboxOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                userSelect: 'none'
              }}
              onClick={() => setIsLightboxOpen(false)}
            >
              {/* Modal Top Header */}
              <div 
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.5rem 1rem', 
                  color: '#ffffff', 
                  zIndex: 10001 
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>
                  {product.name} ({selectedImageIndex + 1} / {productImages.length})
                </div>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  aria-label="Close Full Screen"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Center Image View */}
              <div 
                style={{ 
                  position: 'relative', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '100%', 
                  flex: 1, 
                  maxHeight: '82vh' 
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {productImages.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10002,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                    }}
                    aria-label="Previous Image"
                  >
                    <ChevronLeft size={28} />
                  </button>
                )}

                <img
                  src={currentImage}
                  alt={product.name}
                  style={{
                    maxHeight: '82vh',
                    maxWidth: '92vw',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                  }}
                />

                {productImages.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNextImage}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10002,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                    }}
                    aria-label="Next Image"
                  >
                    <ChevronRight size={28} />
                  </button>
                )}
              </div>

              {/* Modal Bottom Thumbnails */}
              {productImages.length > 1 && (
                <div 
                  style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    padding: '0.75rem', 
                    overflowX: 'auto', 
                    zIndex: 10001,
                    maxWidth: '100%' 
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: selectedImageIndex === idx ? '2px solid #ea580c' : '1px solid rgba(255,255,255,0.3)',
                        padding: '2px',
                        background: '#ffffff',
                        cursor: 'pointer',
                        opacity: selectedImageIndex === idx ? 1 : 0.6,
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-col">
          <p className="text-xs font-bold text-muted mb-xs uppercase tracking-wider" style={{ color: '#ea580c' }}>
            {product.category}
          </p>
          <h1 className="text-2xl md:text-3xl mb-xs font-bold" style={{ lineHeight: 1.3 }}>
            {product.name}
          </h1>
          
          <div className="flex items-center gap-xs mb-sm">
            <span style={{ color: '#f59e0b', fontSize: '1rem' }}>★★★★★</span>
            <span className="text-xs font-medium text-muted">{product.rating || 4.9} / 5.0 (Customer Verified)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-sm mb-md pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="text-2xl md:text-3xl font-bold" style={{ color: '#ea580c' }}>
              {currencySymbol}{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-muted" style={{ textDecoration: 'line-through' }}>
                {currencySymbol}{product.compareAtPrice.toLocaleString()}
              </span>
            )}
            <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              Cash on Delivery
            </span>
          </div>

          <p className="text-sm mb-md text-muted" style={{ lineHeight: 1.6 }}>{product.description}</p>

          {/* Variations (if any) */}
          {product.variations && product.variations.map(variation => (
            <div key={variation.name} className="mb-md">
              <h4 className="font-semibold mb-xs text-xs">{variation.name}: {selections[variation.name] || ''}</h4>
              <div className="flex flex-wrap gap-xs">
                {(variation.options || [variation.name]).map(option => (
                  <button 
                    key={option}
                    className={`btn ${selections[variation.name] === option ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', minHeight: '36px' }}
                    onClick={() => handleSelection(variation.name, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity Selector */}
          <div className="mb-md">
            <h4 className="font-semibold mb-xs text-xs">Quantity</h4>
            <div className="flex items-center" style={{ border: '1px solid var(--border-color)', borderRadius: '6px', width: 'fit-content', overflow: 'hidden' }}>
              <button 
                className="btn" 
                style={{ padding: '0.4rem 0.85rem', minHeight: '38px', borderRadius: 0, backgroundColor: 'var(--bg-secondary)', fontSize: '1rem' }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >-</button>
              <span style={{ width: '44px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{quantity}</span>
              <button 
                className="btn" 
                style={{ padding: '0.4rem 0.85rem', minHeight: '38px', borderRadius: 0, backgroundColor: 'var(--bg-secondary)', fontSize: '1rem' }}
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >+</button>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="flex flex-col gap-xs mb-lg">
            <button 
              className="btn btn-primary btn-full text-sm py-md font-bold" 
              onClick={handleBuyNow}
              style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
            >
              Buy Now with Cash on Delivery
            </button>
            <button className="btn btn-outline btn-full text-sm py-md font-semibold" onClick={handleAddToCart}>
              <Plus size={16} /> Add to Cart
            </button>
            {product.video && (
              <button
                type="button"
                onClick={() => {
                  setIsVideoActive(true);
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
                className="btn btn-secondary btn-full text-xs font-bold"
                style={{
                  borderColor: '#ea580c',
                  color: '#ea580c',
                  marginTop: '4px'
                }}
              >
                <Play size={14} fill="#ea580c" /> Watch Video Demonstration (پراڈکٹ ویڈیو دیکھیں)
              </button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 gap-sm bg-secondary" style={{ padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-sm">
              <Truck size={20} style={{ color: '#ea580c', flexShrink: 0 }} />
              <div>
                <h4 className="font-bold text-xs">Cash on Delivery Available</h4>
                <p className="text-xs text-muted">Pay in cash when order arrives at your doorstep</p>
              </div>
            </div>
            <div className="flex items-center gap-sm">
              <Shield size={20} style={{ color: '#ea580c', flexShrink: 0 }} />
              <div>
                <h4 className="font-bold text-xs">Official Brand Warranty</h4>
                <p className="text-xs text-muted">100% Genuine product guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-sm">
              <MessageSquare size={20} style={{ color: '#ea580c', flexShrink: 0 }} />
              <div>
                <h4 className="font-bold text-xs">Direct Support</h4>
                <p className="text-xs text-muted">WhatsApp assistance at +92 327 4000155</p>
              </div>
            </div>
          </div>

          {/* Features List */}
          {product.features && product.features.length > 0 && (
            <div className="mt-lg">
              <h3 className="text-base font-bold mb-sm">Key Features & Specifications</h3>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-xs mb-xs text-xs" style={{ lineHeight: 1.5 }}>
                    <Check size={14} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
        </div>
      </div>

      {/* Sticky Bottom Mobile Bar for Instant Checkout / Add to Cart */}
      <div className="mobile-sticky-action-bar">
        <div style={{ flex: '1 1 35%', minWidth: 0 }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block' }}>Total Price</span>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ea580c', whiteSpace: 'nowrap' }}>
            {currencySymbol}{(product.price * quantity).toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flex: '1 1 65%' }}>
          <button 
            onClick={handleAddToCart}
            className="btn btn-outline"
            style={{ flex: 1, padding: '0.5rem 0.6rem', fontSize: '0.75rem', minHeight: '40px' }}
            aria-label="Add to cart"
          >
            <ShoppingBag size={15} /> Add
          </button>
          <button 
            onClick={handleBuyNow}
            className="btn btn-primary"
            style={{ flex: 1.5, padding: '0.5rem 0.6rem', fontSize: '0.8rem', minHeight: '40px', fontWeight: 700 }}
          >
            Buy COD
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes imgFade {
          from { opacity: 0.4; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
};

export default ProductDetails;
