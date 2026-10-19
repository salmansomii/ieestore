import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { storeConfig } from '../config/store.config';
import { Truck, CheckCircle2, ShoppingBag, ArrowLeft, ShieldCheck, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Checkout = () => {
  const { cart, cartSubtotal, clearCart, showToast } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { currencySymbol, shippingThreshold, flatShippingRate } = storeConfig.settings;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

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

  // Auto scroll to top so order slip is immediately right in front of the screen
  useEffect(() => {
    if (orderSuccess) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [orderSuccess]);

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
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      setOrderSuccess(placedOrder);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error placing order:", error);
      showToast('Issue submitting order. Please check internet connection or call WhatsApp.', 'info');
      setIsProcessing(false);
    }
  };

  // If order was successfully submitted, display confirmation slip right in front of screen
  if (orderSuccess) {
    return (
      <div className="container py-xl" style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Helmet>
          <title>Order Placed Successfully | Taicon Store</title>
        </Helmet>
        
        {/* Printable Order Slip Box */}
        <div 
          id="printable-order-slip"
          className="bg-secondary p-lg" 
          style={{ 
            borderRadius: '16px', 
            border: '2px solid var(--border-color)', 
            boxShadow: 'var(--shadow-md)',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Slip Header Banner */}
          <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(22, 163, 74, 0.12)', color: '#16a34a', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={44} />
            </div>
            
            <h1 className="text-2xl font-bold mb-xs" style={{ color: '#16a34a' }}>Thank You! Order Confirmed</h1>
            <p className="text-muted text-xs mb-sm">
              Your order has been officially booked with <strong>Cash on Delivery (COD)</strong> across Pakistan.
            </p>

            <div style={{ display: 'inline-block', backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-border)', padding: '6px 14px', borderRadius: '8px' }}>
              <span className="text-xs text-muted block">Order Tracking Number</span>
              <span className="font-bold text-lg" style={{ color: '#ea580c', fontFamily: 'monospace' }}>
                #{orderSuccess.orderNumber}
              </span>
            </div>
          </div>

          {/* Customer & Delivery Box */}
          <div 
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '10px', 
              padding: '1rem', 
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem' 
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-sm text-xs">
              <div>
                <p style={{ margin: '0 0 3px 0', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Customer Details:</p>
                <p style={{ margin: '0 0 2px 0', fontWeight: 700, fontSize: '0.875rem' }}>{orderSuccess.shipping.fullName}</p>
                <p style={{ margin: '0 0 2px 0' }}>Phone: <strong>{orderSuccess.contact.phone}</strong></p>
                {orderSuccess.contact.altPhone && <p style={{ margin: '0 0 2px 0', color: 'var(--text-secondary)' }}>WhatsApp: {orderSuccess.contact.altPhone}</p>}
                {orderSuccess.contact.email && orderSuccess.contact.email !== 'N/A' && (
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Email: {orderSuccess.contact.email}</p>
                )}
              </div>
              <div>
                <p style={{ margin: '0 0 3px 0', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Address:</p>
                <p style={{ margin: '0 0 2px 0', fontWeight: 600 }}>{orderSuccess.shipping.address}</p>
                <p style={{ margin: '0 0 2px 0' }}>{orderSuccess.shipping.city}, {orderSuccess.shipping.province}</p>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  Booking Date: {new Date(orderSuccess.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </p>
              </div>
            </div>
          </div>

          {/* Items Summary Table */}
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Ordered Items ({orderSuccess.items?.length || 0})
            </p>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              {orderSuccess.items?.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderBottom: idx !== orderSuccess.items.length - 1 ? '1px solid var(--border-color)' : 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.product?.image && (
                      <img 
                        src={item.product.image} 
                        alt="" 
                        style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '6px', border: '1px solid var(--border-color)', padding: '2px' }} 
                      />
                    )}
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.825rem' }}>{item.product?.name || 'Product'}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        Qty: <strong>{item.quantity}</strong> × {currencySymbol}{(item.product?.price || 0).toLocaleString()}
                        {item.variation && ` • ${Object.values(item.variation).join(', ')}`}
                      </p>
                    </div>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ea580c' }}>
                    {currencySymbol}{((item.product?.price || 0) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Total */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <div className="flex justify-between text-xs mb-xs">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">{currencySymbol}{orderSuccess.summary.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs mb-xs">
              <span className="text-muted">Nationwide Delivery</span>
              <span className="font-bold" style={{ color: '#16a34a' }}>
                {orderSuccess.summary.shipping === 0 ? 'FREE DELIVERY' : `${currencySymbol}${orderSuccess.summary.shipping.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-xs text-base font-bold" style={{ borderTop: '2px dashed var(--border-color)', marginTop: '4px' }}>
              <div>
                <span>Total Cash on Delivery:</span>
                <span className="block text-xs" style={{ color: '#16a34a', fontWeight: 600 }}>Pay cash when parcel arrives</span>
              </div>
              <span style={{ color: '#ea580c', fontSize: '1.35rem', fontWeight: 900 }}>
                {currencySymbol}{orderSuccess.summary.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-md no-print">
            <Link 
              to="/" 
              className="btn btn-primary text-sm font-bold" 
              style={{ 
                backgroundColor: '#ea580c', 
                borderColor: '#ea580c', 
                padding: '0.75rem 2rem', 
                minHeight: '42px',
                borderRadius: '8px'
              }}
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="container py-lg">
      <Helmet>
        <title>Cash on Delivery Checkout | Taicon Store</title>
        <meta name="description" content="Safe and easy Cash on Delivery Checkout at Taicon Store." />
      </Helmet>

      <div className="mb-md">
        <Link to="/cart" className="text-muted hover-text flex items-center gap-xs font-semibold text-xs">
          <ArrowLeft size={14} /> Back to Cart
        </Link>
      </div>

      <div className="mb-md">
        <h1 className="text-2xl font-bold flex items-center gap-xs">
          <Truck size={24} style={{ color: '#ea580c' }} /> Cash on Delivery Checkout
        </h1>
        <p className="text-muted text-xs mt-xs">Pay in cash when your parcel is delivered at your doorstep across Pakistan.</p>
      </div>

      {/* Mobile Collapsible Order Summary Accordion */}
      <div 
        className="md:hidden mb-md bg-secondary" 
        style={{ borderRadius: '10px', border: '1px solid var(--border-color)', overflow: 'hidden' }}
      >
        <button
          type="button"
          onClick={() => setShowMobileSummary(!showMobileSummary)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span className="font-bold text-xs flex items-center gap-xs">
            <ShoppingBag size={16} style={{ color: '#ea580c' }} /> Order Summary ({cart.length} items)
            {showMobileSummary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
          <span className="font-bold text-sm" style={{ color: '#ea580c' }}>
            {currencySymbol}{total.toLocaleString()}
          </span>
        </button>

        {showMobileSummary && (
          <div style={{ padding: '0 1rem 0.75rem', borderTop: '1px dashed var(--border-color)' }}>
            {cart.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '0.4rem 0' }}>
                <span style={{ flex: 1, paddingRight: '8px' }}>{item.quantity}x {item.product.name}</span>
                <span className="font-bold">{currencySymbol}{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid var(--border-color)' }}>
              <span>Delivery</span>
              <span className="font-bold" style={{ color: shipping === 0 ? '#16a34a' : 'inherit' }}>{shipping === 0 ? 'FREE' : `${currencySymbol}${shipping}`}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-lg" style={{ alignItems: 'flex-start' }}>
        
        {/* Delivery Form */}
        <div style={{ flex: '1 1 60%', width: '100%' }}>
          <form id="cod-checkout-form" onSubmit={handleSubmit}>
            
            {/* Delivery Contact Info */}
            <div className="mb-md bg-secondary" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-base font-bold mb-md flex items-center gap-xs">
                <MapPin size={18} style={{ color: '#ea580c' }} /> Delivery & Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold mb-xs block">Full Name *</label>
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
                  <label className="text-xs font-semibold mb-xs block">Phone Number (For Delivery Call) *</label>
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
                  <label className="text-xs font-semibold mb-xs block">WhatsApp / Alternate Phone</label>
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
                  <label className="text-xs font-semibold mb-xs block">
                    Email Address (Optional)
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    className="input" 
                    placeholder="name@example.com" 
                    value={shippingInfo.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold mb-xs block">Complete Address (House/Shop/Street) *</label>
                  <textarea 
                    name="address" 
                    required 
                    rows={2} 
                    className="input" 
                    placeholder="House / Shop / Flat No, Street, Area"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold mb-xs block">City *</label>
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
                  <label className="text-xs font-semibold mb-xs block">Province *</label>
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
                  <label className="text-xs font-semibold mb-xs block">Delivery Notes / Landmark (Optional)</label>
                  <input 
                    type="text" 
                    name="notes" 
                    className="input" 
                    placeholder="Nearby landmark, timing preference, etc." 
                    value={shippingInfo.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section - Cash on Delivery */}
            <div className="mb-md bg-secondary" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-base font-bold mb-sm">Payment Method</h2>
              
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '1rem', 
                  backgroundColor: 'var(--accent-light)', 
                  border: '2px solid #ea580c', 
                  borderRadius: '10px' 
                }}
              >
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '5px solid #ea580c', backgroundColor: 'white', flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-xs">
                    <span className="font-bold text-sm">Cash on Delivery (COD)</span>
                    <span style={{ backgroundColor: '#16a34a', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>VERIFIED</span>
                  </div>
                  <p className="text-xs text-muted mt-xs" style={{ margin: '2px 0 0 0', fontSize: '0.75rem' }}>
                    Pay in cash when you receive the package at your address. No advance card needed!
                  </p>
                </div>
              </div>

              <div className="mt-xs flex items-center gap-xs text-xs text-muted" style={{ fontSize: '0.7rem' }}>
                <ShieldCheck size={14} style={{ color: '#16a34a' }} />
                <span>100% Safe shopping with physical package inspection on delivery</span>
              </div>
            </div>

            {/* Order Now Submit Button - DIRECTLY UNDER THE FORM ON BOTH DESKTOP & MOBILE */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary btn-full font-bold" 
                disabled={isProcessing}
                style={{ 
                  backgroundColor: '#ea580c', 
                  borderColor: '#ea580c', 
                  fontSize: '1rem', 
                  padding: '0.875rem 1.5rem',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                }}
              >
                {isProcessing ? 'Placing Order...' : `Confirm Order (${currencySymbol}${total.toLocaleString()}) - Cash on Delivery`}
              </button>
            </div>
            
          </form>
        </div>

        {/* Desktop Order Summary Sidebar */}
        <div style={{ flex: '1 1 40%', width: '100%', position: 'sticky', top: '80px' }} className="hidden md:block">
          <div className="bg-secondary" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-base font-bold mb-sm flex items-center gap-xs">
              <ShoppingBag size={18} /> Order Summary ({cart.length} items)
            </h2>
            
            <div className="mb-md" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-sm mb-xs pb-xs" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={item.product.image} 
                      alt="" 
                      style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px', backgroundColor: 'white', border: '1px solid var(--border-color)', padding: '2px' }} 
                    />
                    <span style={{ 
                      position: 'absolute', 
                      top: '-5px', 
                      right: '-5px', 
                      backgroundColor: '#ea580c', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: '18px', 
                      height: '18px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.65rem', 
                      fontWeight: 700 
                    }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="font-semibold text-xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted" style={{ fontSize: '0.7rem' }}>{currencySymbol}{item.product.price.toLocaleString()} each</p>
                  </div>
                  <div className="font-bold text-xs">
                    {currencySymbol}{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mb-xs text-xs">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">{currencySymbol}{cartSubtotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between mb-xs text-xs">
              <span className="text-muted">Delivery Charges</span>
              <span className="font-semibold" style={{ color: shipping === 0 ? '#16a34a' : 'inherit' }}>
                {shipping === 0 ? 'FREE Shipping' : `${currencySymbol}${shipping.toLocaleString()}`}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-md pt-xs text-base font-bold" style={{ borderTop: '2px dashed var(--border-color)' }}>
              <span>Total Payable</span>
              <span style={{ color: '#ea580c' }}>{currencySymbol}{total.toLocaleString()}</span>
            </div>

            <button 
              type="submit" 
              form="cod-checkout-form"
              className="btn btn-primary btn-full text-sm py-md flex items-center justify-center gap-xs font-bold" 
              disabled={isProcessing}
              style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
            >
              {isProcessing ? 'Placing Order...' : `Confirm Order (Cash on Delivery)`}
            </button>
            
            <p className="text-xs text-center text-muted mt-xs" style={{ fontSize: '0.7rem' }}>
              Your order will be booked & dispatched with Cash on Delivery.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
