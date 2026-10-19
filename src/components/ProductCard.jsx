import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { storeConfig } from '../config/store.config';
import { Plus } from 'lucide-react';

const ProductCard = ({ product, priority = false }) => {
  const { addToCart } = useCart();
  const { currencySymbol } = storeConfig.settings;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariation = product.variations && product.variations.length > 0 
      ? { [product.variations[0].name]: product.variations[0].options ? product.variations[0].options[0] : product.variations[0].name } 
      : null;
    addToCart(product, 1, defaultVariation);
  };

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="product-card"
    >
      <div className="product-image-box">
        <img 
          src={product.image} 
          alt={product.name} 
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
          decoding="async"
          width="320"
          height="320"
        />
        {product.discountPercentage > 0 && (
          <div 
            style={{ 
              position: 'absolute', 
              top: '6px', 
              left: '6px', 
              backgroundColor: '#ea580c', 
              color: 'white', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              fontSize: '0.675rem', 
              fontWeight: 700 
            }}
          >
            -{product.discountPercentage}%
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <p 
          style={{ 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.04em', 
            color: '#ea580c',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {product.category}
        </p>

        <h3 
          style={{ 
            fontSize: '0.875rem', 
            fontWeight: 600, 
            lineHeight: 1.35,
            marginBottom: '6px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4em'
          }}
        >
          {product.name}
        </h3>
        
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#ea580c' }}>
            {currencySymbol}{product.price.toLocaleString()}
          </span>
          {product.compareAtPrice && (
            <span style={{ color: 'var(--text-secondary)', textDecoration: 'line-through', fontSize: '0.75rem' }}>
              {currencySymbol}{product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button 
          onClick={handleQuickAdd}
          className="btn btn-outline btn-full text-xs"
          style={{ 
            padding: '0.45rem 0.5rem', 
            minHeight: '36px',
            fontSize: '0.8rem',
            borderRadius: '6px'
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus size={14} /> Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
