import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { storeConfig } from '../config/store.config';
import { Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartSubtotal } = useCart();
  const navigate = useNavigate();
  const { currencySymbol, shippingThreshold, flatShippingRate } = storeConfig.settings;

  const shipping = cartSubtotal >= shippingThreshold || cartSubtotal === 0 ? 0 : flatShippingRate;
  const total = cartSubtotal + shipping;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container py-xxl text-center" style={{ maxWidth: '550px', margin: '2rem auto' }}>
        <Helmet>
          <title>Shopping Cart | Taicon Store</title>
        </Helmet>
        <div style={{ display: 'inline-flex', padding: '18px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', marginBottom: '1.25rem', color: '#ea580c' }}>
          <ShoppingBag size={42} />
        </div>
        <h1 className="text-2xl mb-xs font-bold">Your Cart is Empty</h1>
        <p className="text-muted text-sm mb-lg">Explore our high-efficiency Solar Systems and smart Home Products.</p>
        <div className="flex justify-center gap-sm flex-wrap">
          <Link to="/shop/Solar System" className="btn btn-primary text-xs" style={{ padding: '0.65rem 1.5rem' }}>
            Browse Solar
          </Link>
          <Link to="/shop/Home Product" className="btn btn-outline text-xs" style={{ padding: '0.65rem 1.5rem' }}>
            Browse Appliances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-lg">
      <Helmet>
        <title>Shopping Cart | Taicon Store</title>
        <meta name="description" content="View items in your Taicon Store cart with Cash on Delivery across Pakistan." />
      </Helmet>
      
      <div className="flex justify-between items-center mb-md flex-wrap gap-xs">
        <h1 className="text-2xl font-bold flex items-center gap-xs">
          <ShoppingBag size={24} style={{ color: '#ea580c' }} /> Shopping Cart
        </h1>
        <span className="text-muted text-xs font-semibold">{cart.length} item{cart.length > 1 ? 's' : ''} in cart</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-lg" style={{ alignItems: 'flex-start' }}>
        
        {/* Cart Items List */}
        <div style={{ flex: '1 1 65%', width: '100%' }}>
          {cart.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px',
                padding: '0.875rem',
                marginBottom: '0.75rem',
                backgroundColor: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)', flexShrink: 0, padding: '4px' }} 
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link 
                    to={`/product/${item.product.id}`} 
                    style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} 
                    className="hover-text"
                  >
                    {item.product.name}
                  </Link>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ea580c', marginTop: '2px' }}>
                    {currencySymbol}{item.product.price.toLocaleString()}
                  </div>
                  {item.variation && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {Object.entries(item.variation).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => removeFromCart(item.product.id, item.variation)}
                  style={{ color: '#ef4444', padding: '6px', cursor: 'pointer', background: 'none', border: 'none' }}
                  aria-label="Remove item"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Stepper & Line Total Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                {/* Stepper */}
                <div className="flex items-center" style={{ border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                  <button 
                    className="btn" 
                    style={{ padding: '0.25rem 0.65rem', minHeight: '32px', borderRadius: 0, backgroundColor: 'var(--bg-secondary)', fontSize: '0.9rem' }} 
                    onClick={() => updateQuantity(item.product.id, item.variation, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span style={{ width: '36px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{item.quantity}</span>
                  <button 
                    className="btn" 
                    style={{ padding: '0.25rem 0.65rem', minHeight: '32px', borderRadius: 0, backgroundColor: 'var(--bg-secondary)', fontSize: '0.9rem' }} 
                    onClick={() => updateQuantity(item.product.id, item.variation, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Total: <span style={{ color: '#ea580c' }}>{currencySymbol}{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1 1 35%', width: '100%', backgroundColor: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', position: 'sticky', top: '80px' }}>
          <h2 className="text-lg font-bold mb-md">Order Summary</h2>
          
          <div className="flex justify-between mb-xs text-xs">
            <span className="text-muted">Subtotal</span>
            <span className="font-bold">{currencySymbol}{cartSubtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between mb-xs text-xs">
            <span className="text-muted">Delivery Charges</span>
            <span className="font-bold" style={{ color: shipping === 0 ? '#16a34a' : 'inherit' }}>
              {shipping === 0 ? 'FREE' : `${currencySymbol}${shipping.toLocaleString()}`}
            </span>
          </div>
          
          {shipping === 0 && cartSubtotal > 0 && (
            <p className="text-xs mb-xs" style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.75rem' }}>✓ Free Shipping nationwide applied!</p>
          )}

          <div className="flex justify-between mb-md pt-sm text-lg font-bold" style={{ borderTop: '2px dashed var(--border-color)' }}>
            <span>Total Payable</span>
            <span style={{ color: '#ea580c' }}>{currencySymbol}{total.toLocaleString()}</span>
          </div>

          <div style={{ backgroundColor: 'var(--accent-light)', padding: '0.625rem 0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--accent-border)' }}>
            <p className="text-xs font-bold flex items-center gap-xs" style={{ color: '#ea580c', margin: 0 }}>
              <Truck size={15} /> Cash on Delivery Available
            </p>
            <p className="text-xs text-muted mt-xs" style={{ margin: '2px 0 0 0', fontSize: '0.7rem' }}>
              Pay cash at your doorstep when you receive the order.
            </p>
          </div>

          <button 
            className="btn btn-primary btn-full text-sm py-md mb-xs flex items-center justify-center gap-xs font-bold" 
            onClick={handleCheckout}
            style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
          >
            Cash on Delivery Checkout <ArrowRight size={16} />
          </button>
          
          <Link to="/shop" className="btn btn-outline btn-full text-center text-xs" style={{ minHeight: '38px' }}>
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Cart;
