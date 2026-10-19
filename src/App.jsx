import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ChatSupport from './components/ChatSupport';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const InfoPage = lazy(() => import('./pages/InfoPage'));
const Admin = lazy(() => import('./pages/Admin'));
const Account = lazy(() => import('./pages/Account'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Fast loading spinner fallback
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[50vh] py-xxl">
    <div style={{
      width: '36px',
      height: '36px',
      border: '3px solid #e2e8f0',
      borderTopColor: '#ea580c',
      borderRadius: '50%',
      animation: 'appSpin 0.75s linear infinite'
    }}></div>
    <style dangerouslySetInnerHTML={{__html: `@keyframes appSpin { to { transform: rotate(360deg); } }`}} />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen" style={{ position: 'relative', overflowX: 'hidden' }}>
          <Header />
          <main className="flex-1" style={{ width: '100%' }}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order" element={<Admin />} />
                <Route path="/orders" element={<Admin />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/account" element={<Account />} />
                
                {/* Informational Pages */}
                <Route path="/about" element={<InfoPage title="About Us" />} />
                <Route path="/contact" element={<InfoPage title="Contact Us" />} />
                <Route path="/faq" element={<InfoPage title="FAQ" />} />
                <Route path="/shipping" element={<InfoPage title="Shipping Policy" />} />
                <Route path="/returns" element={<InfoPage title="Return & Refund Policy" />} />
                <Route path="/privacy" element={<InfoPage title="Privacy Policy" />} />
                <Route path="/terms" element={<InfoPage title="Terms & Conditions" />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <BottomNav />
          <ChatSupport />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
