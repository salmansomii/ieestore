import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { storeConfig } from '../config/store.config';
import { Truck, CheckCircle2, ShoppingBag, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Checkout = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { currencySymbol, shippingThreshold, flatShippingRate } = storeConfig.settings;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    altPhone: '',
    email: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    notes: ''
  });

  const pakistaniCities = [
    'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
    'Multan', 'Gujranwala', 'Peshawar', 'Quetta', 'Sialkot', 
    'Sargodha', 'Bahawalpur', 'Sukkur', 'Gujrat', 'Sheikhupura', 
    'Jhang', 'Rahim Yar Khan', 'Mardan', 'Kasur', 'Other'
  ];

  const provinces = [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
    'Islamabad Capital Territory', 'Azad Jammu & Kashmir', 'Gilgit-Baltistan'
  ];

  useEffect(() => {
    if (cart.length === 0 && !isProcessing && !orderSuccess) {
      navigate('/cart');
    }
  }, [cart, navigate, isProcessing, orderSuccess]);

  const shipping = cartSubtotal >= shippingThreshold || cartSubtotal === 0 ? 0 : flatShippingRate;
  const total = cartSubtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderNumber = 'TAI-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderNumber: orderNumber,
      userId: currentUser ? currentUser.uid : 'guest',
      date: new Date().toISOString(),
      contact: {
        email: shippingInfo.email || 'N/A',
        phone: shippingInfo.phone,
        altPhone: shippingInfo.altPhone || ''
      },
      shipping: {
        fullName: shippingInfo.fullName,
        address: shippingInfo.address,
        city: shippingInfo.city,
        province: shippingInfo.province,
        notes: shippingInfo.notes || ''
      },
      payment: {
        method: 'Cash on Delivery (COD)',
        status: 'Unpaid (COD)'
      },
      items: cart,
      summary: {
        subtotal: cartSubtotal,
        shipping: shipping,
        total: total
      },
      status: 'pending'
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      const placedOrder = { ...orderData, id: docRef.id };
      clearCart();
      setOrderSuccess(placedOrder);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error placing order:", error);
      alert('There was an issue submitting your order. Please check your network connection and try again, or contact us directly on WhatsApp.');
      setIsProcessing(false);
    }
  };

  // If order was successfully submitted, display confirmation screen
  if (orderSuccess) {
    return (
      <div className="container py-xxl" style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center' }}>
        <Helmet>
          <title>Order Placed Successfully | Taicon Store</title>
        </Helmet>
        
        <div className="bg-secondary p-xl" style={{ borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#16a34a', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={56} />
          </div>
          
          <h1 className="text-3xl font-bold mb-xs" style={{ color: '#16a34a' }}>Thank You! Order Confirmed</h1>
          <p className="text-muted text-lg mb-lg">Your order has been placed with <strong>Cash on Delivery (COD)</strong>.</p>
          
          <div className="bg-primary p-md mb-lg" style={{ borderRadius: '10px', textAlign: 'left', border: '1px solid var(--border-color)' }}>
            <div className="flex justify-between items-center mb-sm pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="text-xs text-muted block">Order Tracking Number</span>
                <span className="font-bold text-lg" style={{ color: '#ea580c' }}>{orderSuccess.orderNumber}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="text-xs text-muted block">Payment Method</span>
                <span className="font-bold text-sm" style={{ color: '#16a34a' }}>Cash on Delivery</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md text-sm mb-md">
              <div>
                <p className="font-bold mb-xs">Customer Details:</p>
                <p>{orderSuccess.shipping.fullName}</p>
                <p>Phone: {orderSuccess.contact.phone}</p>
                {orderSuccess.contact.email && <p>Email: {orderSuccess.contact.email}</p>}
              </div>
              <div>
                <p className="font-bold mb-xs">Delivery Address:</p>
                <p>{orderSuccess.shipping.address}</p>
                <p>{orderSuccess.shipping.city}, {orderSuccess.shipping.province}</p>
              </div>
            </div>

            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
              <div className="flex justify-between font-bold text-base">
                <span>Total Amount to Pay on Delivery:</span>
                <span style={{ color: '#ea580c' }}>{currencySymbol}{orderSuccess.summary.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted mb-xl">
            Our representative will call your number (<strong>{orderSuccess.contact.phone}</strong>) before dispatching to verify your address.
          </p>

          <div className="flex justify-center gap-md flex-wrap">
            <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              Return to Home
            </Link>
            <Link to="/shop" className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-xl">
      <Helmet>
        <title>Cash on Delivery Checkout | Taicon Store</title>
        <meta name="description" content="Safe and easy Cash on Delivery Checkout at Taicon Store." />
      </Helmet>

      <div className="mb-lg">
        <Link to="/cart" className="text-muted hover-text flex items-center gap-xs font-medium text-sm">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
      </div>

      <div className="flex justify-between items-center mb-xl flex-wrap gap-sm">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-sm">
            <Truck size={30} style={{ color: '#ea580c' }} /> Cash on Delivery Checkout
          </h1>
          <p className="text-muted text-sm mt-xs">Pay in cash when your parcel is delivered at your doorstep across Pakistan.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-xl" style={{ alignItems: 'flex-start' }}>
        
        {/* Delivery Form */}
        <div style={{ flex: '1 1 60%', width: '100%' }}>
          <form id="cod-checkout-form" onSubmit={handleSubmit}>
            
            {/* Delivery Contact Info */}
            <div className="mb-xl bg-secondary" style={{ padding: '1.75rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-xl font-bold mb-md flex items-center gap-xs">
                <MapPin size={20} style={{ color: '#ea580c' }} /> Delivery & Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold mb-xs block">Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    required 
                    className="input" 
                    placeholder="Enter recipient full name"
                    value={shippingInfo.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-xs block">Phone Number (For Delivery Call) *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    className="input" 
                    placeholder="e.g. 0300 1234567" 
                    value={shippingInfo.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-xs block">WhatsApp / Alternate Phone (Optional)</label>
                  <input 
                    type="tel" 
                    name="altPhone" 
                    className="input" 
                    placeholder="e.g. 0321 9876543" 
                    value={shippingInfo.altPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold mb-xs block">Email Address (Optional, for invoice copy)</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="input" 
                    placeholder="email@example.com" 
                    value={shippingInfo.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold mb-xs block">Complete Street Address (House/Shop/Plaza/Floor) *</label>
                  <textarea 
                    name="address" 
                    required 
                    rows={3} 
                    className="input" 
                    placeholder="House / Flat / Shop Number, Street Name, Sector or Area"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-xs block">City *</label>
                  <select 
                    name="city" 
                    required 
                    className="input" 
                    value={shippingInfo.city}
                    onChange={handleChange}
                  >
                    {pakistaniCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-xs block">Province *</label>
                  <select 
                    name="province" 
                    required 
                    className="input" 
                    value={shippingInfo.province}
                    onChange={handleChange}
                  >
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold mb-xs block">Delivery Notes / Landmark (Optional)</label>
                  <input 
                    type="text" 
                    name="notes" 
                    className="input" 
                    placeholder="Nearby landmark, delivery timing preference, etc." 
                    value={shippingInfo.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section - Cash on Delivery */}
            <div className="mb-xl bg-secondary" style={{ padding: '1.75rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-xl font-bold mb-md">Payment Method</h2>
              
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '14px', 
                  padding: '1.25rem', 
                  backgroundColor: 'rgba(234, 88, 12, 0.08)', 
                  border: '2px solid #ea580c', 
                  borderRadius: '10px' 
                }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '6px solid #ea580c', backgroundColor: 'white' }}></div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-xs">
                    <span className="font-bold text-base">Cash on Delivery (COD)</span>
                    <span style={{ backgroundColor: '#16a34a', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>VERIFIED</span>
                  </div>
                  <p className="text-sm text-muted mt-xs" style={{ margin: '4px 0 0 0' }}>
                    Pay in cash when you receive the package at your address. No advance card payment needed!
                  </p>
                </div>
              </div>

              <div className="mt-md flex items-center gap-xs text-xs text-muted">
                <ShieldCheck size={16} style={{ color: '#16a34a' }} />
                <span>100% Safe & Secure shopping with inspection on delivery</span>
              </div>
            </div>
            
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ flex: '1 1 40%', width: '100%', position: 'sticky', top: '100px' }}>
          <div className="bg-secondary" style={{ padding: '1.75rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-xl font-bold mb-md flex items-center gap-xs">
              <ShoppingBag size={20} /> Order Summary ({cart.length} items)
            </h2>
            
            <div className="mb-lg" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-md mb-md pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', backgroundColor: 'white' }} 
                    />
                    <span style={{ 
                      position: 'absolute', 
                      top: '-6px', 
                      right: '-6px', 
                      backgroundColor: '#ea580c', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: '20px', 
                      height: '20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.75rem', 
                      fontWeight: 700 
                    }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="font-semibold text-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted">{currencySymbol}{item.product.price.toLocaleString()} each</p>
                  </div>
                  <div className="font-bold text-sm">
                    {currencySymbol}{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mb-xs text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">{currencySymbol}{cartSubtotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between mb-sm text-sm">
              <span className="text-muted">Delivery Charges</span>
              <span className="font-semibold" style={{ color: shipping === 0 ? '#16a34a' : 'inherit' }}>
                {shipping === 0 ? 'FREE Shipping' : `${currencySymbol}${shipping.toLocaleString()}`}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-xl pt-md text-xl font-bold" style={{ borderTop: '2px dashed var(--border-color)' }}>
              <span>Total Payable</span>
              <span style={{ color: '#ea580c' }}>{currencySymbol}{total.toLocaleString()}</span>
            </div>

            <button 
              type="submit" 
              form="cod-checkout-form"
              className="btn btn-primary btn-full text-base py-md flex items-center justify-center gap-sm font-bold" 
              disabled={isProcessing}
              style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
            >
              {isProcessing ? 'Placing Order...' : `Confirm Order (Cash on Delivery)`}
            </button>
            
            <p className="text-xs text-center text-muted mt-md">
              By confirming, your order will be booked and dispatched via courier with cash on delivery.
            </p>
          </div>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .md\\:flex-row { flex-direction: row; }
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .md\\:col-span-2 { grid-column: span 2 / span 2; }
        }
      `}} />
    </div>
  );
};

export default Checkout;
