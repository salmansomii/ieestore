import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { storeConfig } from '../config/store.config';
import { Check, Shield, Truck, RotateCcw } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState({});

  if (!product) {
    return <div className="container py-xxl text-center">Product not found.</div>;
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
      alert('Please select all options before adding to cart.');
      return;
    }
    addToCart(product, quantity, Object.keys(selections).length ? selections : null);
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!isVariationSelected()) {
      alert('Please select all options before purchasing.');
      return;
    }
    addToCart(product, quantity, Object.keys(selections).length ? selections : null);
    
    if (storeConfig.customCheckoutUrl) {
      window.location.href = storeConfig.customCheckoutUrl;
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="container py-xl">
      <div className="grid md:grid-cols-2 gap-xl" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Images */}
        <div>
          <div style={{ position: 'relative', borderRadius: 'var(--border-radius)', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', aspectRatio: '1/1' }}>
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
            {product.discountPercentage > 0 && (
              <div style={{ position: 'absolute', top: '16px', left: '16px' }} className="badge badge-sale text-lg">
                Save {product.discountPercentage}%
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-col">
          <p className="text-sm text-muted mb-sm uppercase tracking-wider">{product.category}</p>
          <h1 className="text-3xl mb-sm" style={{ fontWeight: 800 }}>{product.name}</h1>
          
          <div className="flex items-center gap-sm mb-md">
            <span style={{ color: '#FFD700', fontSize: '1.2rem' }}>★★★★★</span>
            <span className="text-sm font-medium">{product.rating} / 5.0</span>
          </div>

          <div className="flex items-end gap-sm mb-lg pb-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="text-3xl font-bold">{storeConfig.settings.currencySymbol}{product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted" style={{ textDecoration: 'line-through', marginBottom: '4px' }}>
                {storeConfig.settings.currencySymbol}{product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-lg mb-lg" style={{ lineHeight: 1.6 }}>{product.description}</p>

          {/* Variations */}
          {product.variations && product.variations.map(variation => (
            <div key={variation.name} className="mb-md">
              <h4 className="font-semibold mb-sm">{variation.name}: {selections[variation.name] || ''}</h4>
              <div className="flex flex-wrap gap-sm">
                {variation.options.map(option => (
                  <button 
                    key={option}
                    className={`btn ${selections[variation.name] === option ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '0.5rem 1rem', borderRadius: '4px' }}
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
            <h4 className="font-semibold mb-sm">Quantity</h4>
            <div className="flex items-center" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', width: 'fit-content' }}>
              <button 
                className="btn" 
                style={{ padding: '0.5rem 1rem' }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >-</button>
              <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
              <button 
                className="btn" 
                style={{ padding: '0.5rem 1rem' }}
                onClick={() => setQuantity(quantity + 1)}
              >+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-sm mb-xl">
            <button className="btn btn-outline btn-full text-lg py-md" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn btn-primary btn-full text-lg py-md" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 gap-md bg-secondary" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
            <div className="flex items-center gap-md">
              <Truck size={24} color="var(--accent-color)" />
              <div>
                <h4 className="font-semibold text-sm">Fast USA Shipping</h4>
                <p className="text-xs text-muted">Free over ${storeConfig.settings.shippingThreshold}</p>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <Shield size={24} color="var(--accent-color)" />
              <div>
                <h4 className="font-semibold text-sm">Secure Checkout</h4>
                <p className="text-xs text-muted">100% Protected Payments</p>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <RotateCcw size={24} color="var(--accent-color)" />
              <div>
                <h4 className="font-semibold text-sm">30-Day Returns</h4>
                <p className="text-xs text-muted">Hassle-free return policy</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-xl">
            <h3 className="text-xl font-bold mb-md">Product Features</h3>
            <ul style={{ listStyleType: 'none' }}>
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-sm mb-sm text-md">
                  <Check size={18} color="var(--success-color)" /> {feature}
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
