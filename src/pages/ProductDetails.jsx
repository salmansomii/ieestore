import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products as localProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { storeConfig } from '../config/store.config';
import { Check, Shield, Truck, MessageSquare, ArrowLeft, Plus, ShoppingBag } from 'lucide-react';
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
  const { currencySymbol } = storeConfig.settings;

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && isMounted) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else if (isMounted) {
          const localMatch = localProducts.find(p => p.id === id);
          if (localMatch) setProduct(localMatch);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        if (isMounted) {
          const localMatch = localProducts.find(p => p.id === id);
          if (localMatch) setProduct(localMatch);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => { isMounted = false; };
  }, [id]);

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
        
        {/* Product Image */}
        <div>
          <div 
            style={{ 
              position: 'relative', 
              borderRadius: '14px', 
              overflow: 'hidden', 
              backgroundColor: '#ffffff', 
              aspectRatio: '1/1', 
              border: '1px solid var(--border-color)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '1rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full"
              style={{ objectFit: 'contain' }}
              fetchpriority="high"
            />
            {product.discountPercentage > 0 && (
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
                  fontWeight: 700 
                }}
              >
                Save {product.discountPercentage}%
              </div>
            )}
          </div>
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
    </div>
  );
};

export default ProductDetails;
