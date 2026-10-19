import { Helmet } from 'react-helmet-async';
import { storeConfig } from '../config/store.config';
import { Phone, Mail, MapPin } from 'lucide-react';

const InfoPage = ({ title }) => {
  return (
    <div className="container py-xl" style={{ maxWidth: '800px' }}>
      <Helmet>
        <title>{title} | Taicon Store</title>
      </Helmet>
      
      <h1 className="text-2xl md:text-3xl mb-lg font-bold">{title}</h1>
      
      <div style={{ lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        {title === 'Return & Refund Policy' ? (
          <div>
            <p className="mb-md">
              At <strong>Taicon Store</strong>, customer satisfaction and genuine trust are our highest priorities. We offer a transparent, customer-friendly warranty and return process across Pakistan.
            </p>
            <h2 className="text-lg mb-xs font-bold" style={{ color: 'var(--text-primary)' }}>1. Inspection on Delivery</h2>
            <p className="mb-md">
              Because all orders are delivered with <strong>Cash on Delivery (COD)</strong>, you can inspect your parcel before accepting it. If the item is damaged or incorrect, you may refuse delivery on the spot.
            </p>
            <h2 className="text-lg mb-xs font-bold" style={{ color: 'var(--text-primary)' }}>2. Official Warranty & Claims</h2>
            <p className="mb-md">
              All Tier-1 Solar Panels, Hybrid Inverters, and Home Appliances come with manufacturer brand warranty cards. If you ever experience any technical issue, our dedicated support team will help process the warranty claim.
            </p>
            <h2 className="text-lg mb-xs font-bold" style={{ color: 'var(--text-primary)' }}>3. Direct Assistance</h2>
            <p className="mb-md">
              For any queries, exchanges, or returns, contact our WhatsApp hotline directly at <strong>+92 327 4000155</strong>.
            </p>
          </div>
        ) : title === 'Shipping Policy' ? (
          <div>
            <p className="mb-md">
              We deliver solar systems and home appliances nationwide across Pakistan via trusted courier services and cargo logistics.
            </p>
            <h2 className="text-lg mb-xs font-bold" style={{ color: 'var(--text-primary)' }}>1. Cash on Delivery Nationwide</h2>
            <p className="mb-md">
              No advance payments or online cards needed! Pay cash when the courier delivers your package to your doorstep.
            </p>
            <h2 className="text-lg mb-xs font-bold" style={{ color: 'var(--text-primary)' }}>2. Delivery Timelines</h2>
            <p className="mb-md">
              Major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad): <strong>2 - 3 business days</strong>. Other nationwide locations: <strong>3 - 5 business days</strong>.
            </p>
            <h2 className="text-lg mb-xs font-bold" style={{ color: 'var(--text-primary)' }}>3. Verification Call</h2>
            <p className="mb-md">
              Before shipping, our representative will call or WhatsApp your provided phone number to confirm your address and order details.
            </p>
          </div>
        ) : title === 'Contact Us' ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
              <div className="bg-secondary p-md" style={{ borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <Phone size={22} style={{ color: '#ea580c', marginBottom: '8px' }} />
                <h3 className="font-bold text-sm mb-xs">Call / WhatsApp</h3>
                <p className="text-xs">{storeConfig.contact.phone}</p>
              </div>
              <div className="bg-secondary p-md" style={{ borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <Mail size={22} style={{ color: '#ea580c', marginBottom: '8px' }} />
                <h3 className="font-bold text-sm mb-xs">Email Us</h3>
                <p className="text-xs">{storeConfig.contact.email}</p>
              </div>
              <div className="bg-secondary p-md" style={{ borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <MapPin size={22} style={{ color: '#ea580c', marginBottom: '8px' }} />
                <h3 className="font-bold text-sm mb-xs">Location</h3>
                <p className="text-xs">{storeConfig.contact.address}</p>
              </div>
            </div>

            <div className="bg-secondary p-lg" style={{ borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h2 className="text-lg mb-sm font-bold" style={{ color: 'var(--text-primary)' }}>Send us a Message</h2>
              <form onSubmit={e => { e.preventDefault(); alert('Message sent! Our support team will get back to you shortly.'); }} className="flex flex-col gap-sm">
                <input type="text" placeholder="Your Name" className="input" required />
                <input type="tel" placeholder="Phone Number" className="input" required />
                <textarea placeholder="How can we help you?" className="input" rows={4} style={{ resize: 'vertical' }} required></textarea>
                <button type="submit" className="btn btn-primary font-bold text-sm" style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}>
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-md">
              Welcome to <strong>Taicon Store</strong>. We are dedicated to providing the highest quality Solar Energy Systems, Hybrid Inverters, Lithium Batteries, and premium Home Appliances across Pakistan.
            </p>
            <p className="mb-md">
              With 100% Cash on Delivery, official brand warranties, and fast nationwide delivery, we empower homeowners and businesses with reliable clean energy and smart living solutions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPage;
