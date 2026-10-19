import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products as localProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { storeConfig } from '../config/store.config';
import { Check, Shield, Truck, Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
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
    return <div className="container py-xxl text-center">Loading product details...</div>;
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
      alert('Please select all product options.');
      return;
    }
    addToCart(product, quantity, Object.keys(selections).length ? selections : null);
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!isVariationSelected()) {
      alert('Please select all product options.');
      return;
    }
    addToCart(product, quantity, Object.keys(selections).length ? selections : null);
    navigate('/checkout');
  };

  return (
    <div className="container py-xl">
      <Helmet>
        <title>{product.name} | Taicon Store</title>
        <meta name="description" content={product.description.substring(0, 150) + '...'} />
      </Helmet>

      <div className="mb-lg">
        <Link to="/shop" className="text-muted hover-text flex items-center gap-xs font-medium text-sm">
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-xl" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
        
        {/* Images */}
        <div>
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#ffffff', aspectRatio: '1/1', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
            {product.discountPercentage > 0 && (
              <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#ea580c', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 700 }}>
                Save {product.discountPercentage}%
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-col">
          <p className="text-xs font-bold text-muted mb-xs uppercase tracking-wider" style={{ color: '#ea580c' }}>{product.category}</p>
          <h1 className="text-3xl mb-sm font-bold" style={{ lineHeight: 1.3 }}>{product.name}</h1>
          
          <div className="flex items-center gap-sm mb-md">
            <span style={{ color: '#f59e0b', fontSize: '1.2rem' }}>★★★★★</span>
            <span className="text-sm font-medium">{product.rating || 4.9} / 5.0</span>
          </div>

          <div className="flex items-end gap-sm mb-lg pb-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="text-3xl font-bold" style={{ color: '#ea580c' }}>
              {currencySymbol}{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted" style={{ textDecoration: 'line-through', marginBottom: '4px' }}>
                {currencySymbol}{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-base mb-lg text-muted" style={{ lineHeight: 1.6 }}>{product.description}</p>

          {/* Variations */}
          {product.variations && product.variations.map(variation => (
            <div key={variation.name} className="mb-md">
              <h4 className="font-semibold mb-sm text-sm">{variation.name}: {selections[variation.name] || ''}</h4>
              <div className="flex flex-wrap gap-sm">
                {(variation.options || [variation.name]).map(option => (
                  <button 
                    key={option}
                    className={`btn ${selections[variation.name] === option ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem' }}
                    onClick={() => handleSelection(variation.name, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-lg">
            <h4 className="font-semibold mb-xs text-sm">Quantity</h4>
            <div className="flex items-center" style={{ border: '1px solid var(--border-color)', borderRadius: '6px', width: 'fit-content', overflow: 'hidden' }}>
              <button 
                className="btn" 
                style={{ padding: '0.5rem 1rem', borderRadius: 0, backgroundColor: 'var(--bg-secondary)' }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >-</button>
              <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
              <button 
                className="btn" 
                style={{ padding: '0.5rem 1rem', borderRadius: 0, backgroundColor: 'var(--bg-secondary)' }}
                onClick={() => setQuantity(quantity + 1)}
              >+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-sm mb-xl">
            <button 
              className="btn btn-primary btn-full text-base py-md font-bold" 
              onClick={handleBuyNow}
              style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
            >
              Buy Now with Cash on Delivery
            </button>
            <button className="btn btn-outline btn-full text-base py-md font-semibold" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 gap-md bg-secondary" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-md">
              <Truck size={22} style={{ color: '#ea580c' }} />
              <div>
                <h4 className="font-bold text-sm">Cash on Delivery Available</h4>
                <p className="text-xs text-muted">Pay at your doorstep across Pakistan</p>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <Shield size={22} style={{ color: '#ea580c' }} />
              <div>
                <h4 className="font-bold text-sm">Official Warranty</h4>
                <p className="text-xs text-muted">100% Genuine brand warranty & support</p>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <MessageSquare size={22} style={{ color: '#ea580c' }} />
              <div>
                <h4 className="font-bold text-sm">Direct Support</h4>
                <p className="text-xs text-muted">WhatsApp assistance at +92 327 4000155</p>
              </div>
            </div>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-xl">
              <h3 className="text-lg font-bold mb-md">Key Features & Specifications</h3>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-sm mb-sm text-sm">
                    <Check size={16} style={{ color: '#16a34a', flexShrink: 0 }} /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
