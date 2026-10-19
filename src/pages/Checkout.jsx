import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { storeConfig } from '../config/store.config';
import { Truck, CheckCircle2, ShoppingBag, ArrowLeft, ShieldCheck, MapPin, ChevronDown, ChevronUp, Printer, MessageCircle, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { sendOrderConfirmationEmail } from '../services/emailService';

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

  // Prevent background scroll when order slip popup is visible
  useEffect(() => {
    if (orderSuccess) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
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

  const handlePrint = () => {
    window.print();
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

      // Auto-send confirmation email to customer (if email was provided, NO SIGNUP required)
      if (shippingInfo.email && shippingInfo.email.includes('@')) {
        sendOrderConfirmationEmail(placedOrder).catch(err => {
          console.error('Error sending confirmation email:', err);
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      showToast('Issue submitting order. Please check internet connection or call WhatsApp.', 'info');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-lg">
      <Helmet>
        <title>Cash on Delivery Checkout | Taicon Store</title>
        <meta name="description" content="Safe and easy Cash on Delivery Checkout at Taicon Store." />
      </Helmet>

      {/* Official Centered Order Slip Modal - Bilkul Samnay Screen Par */}
      {orderSuccess && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto'
          }}
        >
          <div 
            id="printable-order-slip"
            style={{
              width: '100%',
              maxWidth: '680px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '2px solid var(--border-color)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slipPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Slip Header Banner */}
            <div 
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '4px solid #ea580c'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src="/taicon-logo.png" alt="Taicon Store" style={{ height: '38px', width: 'auto', backgroundColor: 'white', padding: '2px 6px', borderRadius: '4px' }} />
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>TAICON STORE</h2>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>Official Cash on Delivery Order Invoice</p>
                </div>
              </div>

              <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    navigate('/shop');
                  }}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="Close"
                  title="Close receipt"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Slip Body (Scrollable if lots of items) */}
            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
              
              {/* Order Status Ribbon */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  padding: '0.625rem 1rem',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a' }}>
                  <CheckCircle2 size={22} />
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', display: 'block' }}>Order Confirmed & Booked</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Cash on Delivery nationwide</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Tracking Order ID</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ea580c', fontFamily: 'monospace' }}>
                    #{orderSuccess.orderNumber}
                  </span>
                </div>
              </div>

              {/* Order Info & Customer Box */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '0.75rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.875rem 1rem',
                  marginBottom: '1rem',
                  fontSize: '0.8rem'
                }}
              >
                <div>
                  <p style={{ margin: '0 0 3px 0', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Customer Details</p>
                  <p style={{ margin: '0 0 2px 0', fontWeight: 700, color: '#0f172a' }}>{orderSuccess.shipping.fullName}</p>
                  <p style={{ margin: '0 0 2px 0', color: '#334155' }}>📞 <strong>{orderSuccess.contact.phone}</strong></p>
                  {orderSuccess.contact.altPhone && <p style={{ margin: '0 0 2px 0', color: '#64748b' }}>WhatsApp: {orderSuccess.contact.altPhone}</p>}
                  {orderSuccess.contact.email && orderSuccess.contact.email !== 'N/A' && (
                    <p style={{ margin: 0, color: '#64748b' }}>✉️ {orderSuccess.contact.email}</p>
                  )}
                </div>

                <div>
                  <p style={{ margin: '0 0 3px 0', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Destination</p>
                  <p style={{ margin: '0 0 2px 0', fontWeight: 600, color: '#0f172a' }}>{orderSuccess.shipping.address}</p>
                  <p style={{ margin: '0 0 2px 0', color: '#334155' }}>📍 {orderSuccess.shipping.city}, {orderSuccess.shipping.province}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>
                    📅 {new Date(orderSuccess.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 6px 0', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Ordered Items ({orderSuccess.items?.length || 0})
                </p>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                  {orderSuccess.items?.map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderBottom: idx !== orderSuccess.items.length - 1 ? '1px solid #e2e8f0' : 'none',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        {item.product?.image && (
                          <img 
                            src={item.product.image} 
                            alt="" 
                            style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '2px', flexShrink: 0 }} 
                          />
                        )}
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.825rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.product?.name || 'Product'}
                          </p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>
                            Qty: <strong>{item.quantity}</strong> × {currencySymbol}{(item.product?.price || 0).toLocaleString()}
                            {item.variation && ` • ${Object.values(item.variation).join(', ')}`}
                          </p>
                        </div>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                        {currencySymbol}{((item.product?.price || 0) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculation & Total Payable */}
              <div 
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.875rem 1rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{currencySymbol}{orderSuccess.summary.subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                  <span>Nationwide Shipping & Handling</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    {orderSuccess.summary.shipping === 0 ? 'FREE DELIVERY' : `${currencySymbol}${orderSuccess.summary.shipping.toLocaleString()}`}
                  </span>
                </div>

                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '2px dashed #cbd5e1',
                    paddingTop: '8px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>Total Cash to Pay on Delivery:</span>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>✓ Pay cash when parcel arrives at doorstep</span>
                  </div>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ea580c' }}>
                    {currencySymbol}{orderSuccess.summary.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Courier Notice Note */}
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#64748b', textAlign: 'center', lineHeight: 1.5 }}>
                ℹ️ Our representative will call your phone (<strong>{orderSuccess.contact.phone}</strong>) before dispatching to verify your address.
              </p>

              {/* Bottom Actions - Hidden on Print */}
              <div className="no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handlePrint}
                  className="btn btn-secondary flex-1 text-xs"
                  style={{ minHeight: '40px', fontWeight: 700 }}
                >
                  <Printer size={16} /> Print / Save Slip
                </button>

                <a
                  href={`https://wa.me/923274000155?text=${encodeURIComponent(`Hello Taicon Store, I just placed order #${orderSuccess.orderNumber} for ${currencySymbol}${orderSuccess.summary.total.toLocaleString()}. Please confirm my order.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn text-xs"
                  style={{
                    flex: 1.2,
                    minHeight: '40px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageCircle size={16} /> Confirm on WhatsApp
                </a>

                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    navigate('/shop');
                  }}
                  className="btn btn-primary flex-1 text-xs"
                  style={{ minHeight: '40px', backgroundColor: '#ea580c', borderColor: '#ea580c', fontWeight: 700 }}
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Normal Checkout Form */}
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
                    Email Address (Order Slip receive karne ke liye)
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    className="input" 
                    placeholder="e.g. yourname@gmail.com" 
                    value={shippingInfo.email}
                    onChange={handleChange}
                  />
                  <span className="text-xs text-muted block mt-xs" style={{ fontSize: '0.7rem' }}>
                    ✓ Kisi signup ya password ki zaroorat nahi — Order confirmation slip direct aapke email par aayegi.
                  </span>
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

            {/* Mobile Submit Button inside Form */}
            <div className="md:hidden mb-lg">
              <button 
                type="submit" 
                className="btn btn-primary btn-full text-sm py-md font-bold" 
                disabled={isProcessing}
                style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
              >
                {isProcessing ? 'Placing Order...' : `Confirm Order (${currencySymbol}${total.toLocaleString()})`}
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
                      alt={item.product.name} 
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
