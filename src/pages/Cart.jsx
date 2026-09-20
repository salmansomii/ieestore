import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { storeConfig } from '../config/store.config';
import { Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartSubtotal } = useCart();
  const navigate = useNavigate();
  const { currencySymbol, shippingThreshold, flatShippingRate, taxRate } = storeConfig.settings;

  const shipping = cartSubtotal >= shippingThreshold || cartSubtotal === 0 ? 0 : flatShippingRate;
  const tax = cartSubtotal * taxRate;
  const total = cartSubtotal + shipping + tax;

  const handleCheckout = () => {
    if (storeConfig.customCheckoutUrl) {
      window.location.href = storeConfig.customCheckoutUrl;
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-xxl text-center">
        <h1 className="text-3xl mb-md">Your Cart is Empty</h1>
        <p className="text-muted mb-xl">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-xl">
      <h1 className="text-3xl mb-xl font-bold">Shopping Cart</h1>
      
      <div className="flex flex-col md:flex-row gap-xl" style={{ alignItems: 'flex-start' }}>
        
        {/* Cart Items */}
        <div style={{ flex: '1 1 60%' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }} className="hidden md:flex justify-between text-muted text-sm uppercase">
            <span style={{ flex: '2' }}>Product</span>
            <span style={{ flex: '1', textAlign: 'center' }}>Quantity</span>
            <span style={{ flex: '1', textAlign: 'right' }}>Total</span>
          </div>

          {cart.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center justify-between gap-md py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
              
              <div className="flex items-center gap-md" style={{ flex: '2', width: '100%' }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <Link to={`/product/${item.product.id}`} className="font-semibold text-lg hover-text">{item.product.name}</Link>
                  <div className="text-sm text-muted mb-sm">{currencySymbol}{item.product.price.toFixed(2)}</div>
                  {item.variation && (
                    <div className="text-xs text-muted">
                      {Object.entries(item.variation).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </div>
                  )}
                  <button 
                    onClick={() => removeFromCart(item.product.id, item.variation)}
                    className="text-danger-color text-sm mt-sm flex items-center gap-sm"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>

              <div style={{ flex: '1', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div className="flex items-center" style={{ border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                  <button className="btn" style={{ padding: '0.25rem 0.5rem' }} onClick={() => updateQuantity(item.product.id, item.variation, item.quantity - 1)}>-</button>
                  <span style={{ width: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <button className="btn" style={{ padding: '0.25rem 0.5rem' }} onClick={() => updateQuantity(item.product.id, item.variation, item.quantity + 1)}>+</button>
                </div>
              </div>

              <div style={{ flex: '1', textAlign: 'right', width: '100%' }} className="font-bold text-lg">
                {currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1 1 35%', backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--border-radius)', position: 'sticky', top: '100px' }}>
          <h2 className="text-2xl font-bold mb-lg">Order Summary</h2>
          
          <div className="flex justify-between mb-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-medium">{currencySymbol}{cartSubtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mb-sm">
            <span className="text-muted">Shipping</span>
            <span className="font-medium">{shipping === 0 ? 'Free' : `${currencySymbol}${shipping.toFixed(2)}`}</span>
          </div>
          
          {shipping === 0 && cartSubtotal > 0 && (
            <p className="text-xs text-success-color mb-sm text-right">You unlocked free shipping!</p>
          )}

          <div className="flex justify-between mb-lg pb-lg" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="text-muted">Estimated Tax</span>
            <span className="font-medium">{currencySymbol}{tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-xl text-xl font-bold">
            <span>Total</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </div>

          <button className="btn btn-primary btn-full text-lg py-md mb-md flex items-center justify-center gap-sm" onClick={handleCheckout}>
            Proceed to Checkout <ArrowRight size={20} />
          </button>
          
          <Link to="/shop" className="btn btn-outline btn-full text-center">
            Continue Shopping
          </Link>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .md\\:flex-row { flex-direction: row; }
          .md\\:flex { display: flex; }
        }
        .hover-text:hover { color: var(--accent-color); }
      `}} />
    </div>
  );
};

export default Cart;
