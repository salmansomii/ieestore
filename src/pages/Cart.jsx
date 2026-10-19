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
      <div className="container py-xxl text-center" style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <Helmet>
          <title>Shopping Cart | Taicon Store</title>
        </Helmet>
        <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', marginBottom: '1.5rem', color: '#ea580c' }}>
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl mb-md font-bold">Your Cart is Empty</h1>
        <p className="text-muted mb-xl">Explore our high-efficiency Solar Systems and smart Home Products.</p>
        <div className="flex justify-center gap-md flex-wrap">
          <Link to="/shop/Solar System" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            Browse Solar Systems
          </Link>
          <Link to="/shop/Home Product" className="btn btn-outline" style={{ padding: '0.75rem 1.75rem' }}>
            Browse Home Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-xl">
      <Helmet>
        <title>Shopping Cart | Taicon Store</title>
        <meta name="description" content="View items in your Taicon Store cart with Cash on Delivery across Pakistan." />
      </Helmet>
      
      <div className="flex justify-between items-center mb-xl flex-wrap gap-sm">
        <h1 className="text-3xl font-bold flex items-center gap-sm">
          <ShoppingBag size={28} style={{ color: '#ea580c' }} /> Shopping Cart
        </h1>
        <span className="text-muted text-sm">{cart.length} item{cart.length > 1 ? 's' : ''} in cart</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-xl" style={{ alignItems: 'flex-start' }}>
        
        {/* Cart Items List */}
        <div style={{ flex: '1 1 65%', width: '100%' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }} className="hidden md:flex justify-between text-muted text-xs font-bold uppercase">
            <span style={{ flex: '2' }}>Product</span>
            <span style={{ flex: '1', textAlign: 'center' }}>Quantity</span>
            <span style={{ flex: '1', textAlign: 'right' }}>Total</span>
          </div>

          {cart.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center justify-between gap-md py-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
              
              <div className="flex items-center gap-md" style={{ flex: '2', width: '100%' }}>
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white' }} 
                />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.product.id}`} className="font-bold text-base hover-text" style={{ textDecoration: 'none' }}>
                    {item.product.name}
                  </Link>
                  <div className="text-sm font-semibold mt-xs" style={{ color: '#ea580c' }}>
                    {currencySymbol}{item.product.price.toLocaleString()}
                  </div>
                  {item.variation && (
                    <div className="text-xs text-muted mt-xs">
                      {Object.entries(item.variation).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </div>
                  )}
                  <button 
                    onClick={() => removeFromCart(item.product.id, item.variation)}
                    className="text-danger-color text-xs mt-sm flex items-center gap-xs"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Trash2 size={13} /> Remove item
                  </button>
                </div>
              </div>

              <div style={{ flex: '1', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div className="flex items-center" style={{ border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                  <button 
                    className="btn" 
                    style={{ padding: '0.4rem 0.75rem', borderRadius: 0, backgroundColor: 'var(--bg-secondary)' }} 
                    onClick={() => updateQuantity(item.product.id, item.variation, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                  <button 
                    className="btn" 
                    style={{ padding: '0.4rem 0.75rem', borderRadius: 0, backgroundColor: 'var(--bg-secondary)' }} 
                    onClick={() => updateQuantity(item.product.id, item.variation, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ flex: '1', textAlign: 'right', width: '100%' }} className="font-bold text-lg">
                {currencySymbol}{(item.product.price * item.quantity).toLocaleString()}
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1 1 35%', width: '100%', backgroundColor: 'var(--bg-secondary)', padding: '1.75rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', position: 'sticky', top: '100px' }}>
          <h2 className="text-xl font-bold mb-lg">Order Summary</h2>
          
          <div className="flex justify-between mb-sm text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-bold">{currencySymbol}{cartSubtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between mb-sm text-sm">
            <span className="text-muted">Delivery Charges</span>
            <span className="font-bold" style={{ color: shipping === 0 ? '#16a34a' : 'inherit' }}>
              {shipping === 0 ? 'FREE' : `${currencySymbol}${shipping.toLocaleString()}`}
            </span>
          </div>
          
          {shipping === 0 && cartSubtotal > 0 && (
            <p className="text-xs text-success-color mb-sm" style={{ color: '#16a34a', fontWeight: 600 }}>✓ Free Shipping nationwide applied!</p>
          )}

          <div className="flex justify-between mb-lg pt-md text-xl font-bold" style={{ borderTop: '2px dashed var(--border-color)' }}>
            <span>Total Payable</span>
            <span style={{ color: '#ea580c' }}>{currencySymbol}{total.toLocaleString()}</span>
          </div>

          <div style={{ backgroundColor: 'rgba(234, 88, 12, 0.08)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid rgba(234, 88, 12, 0.2)' }}>
            <p className="text-xs font-bold flex items-center gap-xs" style={{ color: '#ea580c', margin: 0 }}>
              <Truck size={16} /> Cash on Delivery Available
            </p>
            <p className="text-xs text-muted mt-xs" style={{ margin: '4px 0 0 0' }}>
              Pay when you receive your order at your doorstep.
            </p>
          </div>

          <button 
            className="btn btn-primary btn-full text-base py-md mb-md flex items-center justify-center gap-sm font-bold" 
            onClick={handleCheckout}
            style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
          >
            Cash on Delivery Checkout <ArrowRight size={18} />
          </button>
          
          <Link to="/shop" className="btn btn-outline btn-full text-center text-sm">
            Continue Shopping
          </Link>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .md\\:flex-row { flex-direction: row; }
          .md\\:flex { display: flex; }
        }
        .hover-text:hover { color: #ea580c; }
      `}} />
    </div>
  );
};

export default Cart;
