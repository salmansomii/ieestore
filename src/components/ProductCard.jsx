import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { storeConfig } from '../config/store.config';

const ProductCard = ({ product, priority = false }) => {
  const { addToCart } = useCart();
  const { currencySymbol } = storeConfig.settings;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultVariation = product.variations && product.variations.length > 0 
      ? { [product.variations[0].name]: product.variations[0].options ? product.variations[0].options[0] : product.variations[0].name } 
      : null;
    addToCart(product, 1, defaultVariation);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', marginBottom: '1rem', aspectRatio: '1/1', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
          width="400"
          height="400"
          className="w-full h-full object-contain"
          style={{ transition: 'transform 0.3s ease', maxHeight: '100%' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        {product.discountPercentage > 0 && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#ea580c', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
            Save {product.discountPercentage}%
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p className="text-xs font-bold text-muted mb-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ea580c' }}>
          {product.category}
        </p>
        <h3 className="font-semibold mb-sm" style={{ fontSize: '1rem', lineHeight: 1.4 }}>
          {product.name}
        </h3>
        
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span className="font-bold text-lg" style={{ color: '#ea580c' }}>{currencySymbol}{product.price.toLocaleString()}</span>
          {product.compareAtPrice && (
            <span className="text-muted" style={{ textDecoration: 'line-through', fontSize: '0.85rem' }}>
              {currencySymbol}{product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button 
          onClick={handleQuickAdd}
          className="btn btn-outline btn-full text-sm font-semibold"
          style={{ padding: '0.5rem' }}
        >
          Add to Cart
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .product-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .product-card:hover {
          transform: translateY(-2px);
        }
      `}} />
    </Link>
  );
};

export default ProductCard;
