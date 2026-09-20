import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { storeConfig } from '../config/store.config';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { currencySymbol } = storeConfig.settings;

  const handleQuickAdd = (e) => {
    e.preventDefault(); // Prevent link click
    // Add first variation option if it exists to be safe for demo
    const defaultVariation = product.variations && product.variations.length > 0 
      ? { [product.variations[0].name]: product.variations[0].options[0] } 
      : null;
    addToCart(product, 1, defaultVariation);
    // Optionally trigger a toast here
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--border-radius)', marginBottom: '1rem', aspectRatio: '1/1', backgroundColor: 'var(--bg-secondary)' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain"
          style={{ transition: 'transform 0.3s ease' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        {product.discountPercentage > 0 && (
          <div style={{ position: 'absolute', top: '10px', left: '10px' }} className="badge badge-sale">
            Save {product.discountPercentage}%
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p className="text-xs text-muted mb-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.category}
        </p>
        <h3 className="font-semibold mb-sm" style={{ fontSize: '1rem', lineHeight: 1.4 }}>
          {product.name}
        </h3>
        
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span className="font-bold text-lg">{currencySymbol}{product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-muted" style={{ textDecoration: 'line-through', fontSize: '0.875rem' }}>
              {currencySymbol}{product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        <button 
          onClick={handleQuickAdd}
          className="btn btn-outline btn-full"
          style={{ padding: '0.5rem' }}
        >
          Quick Add
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .product-card {
          transition: transform 0.2s;
        }
      `}} />
    </Link>
  );
};

export default ProductCard;
